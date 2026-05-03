<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'brand', 'galleryImages'])->withCount(['reviews as approved_reviews_count' => fn($q) => $q->where('status','approved')])->latest();

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('brand_id')) {
            $query->where('brand_id', $request->brand_id);
        }

        if ($request->has('featured')) {
            $query->where('is_featured', true);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'                    => 'required|string|max:255',
            'description'             => 'nullable|string',
            'meta_description'        => 'nullable|string|max:160',
            'tags'                    => 'nullable|array',
            'material'                => 'nullable|string',
            'weight'                  => 'nullable|string',
            'price'                   => 'required|numeric',
            'old_price'               => 'nullable|numeric',
            'stock'                   => 'required|integer',
            'stock_status'            => 'in:in_stock,out_of_stock,backorder',
            'backorder_available_date' => 'nullable|date',
            'backorder_message'        => 'nullable|string|max:255',
            'category_id'             => 'nullable|exists:categories,id',
            'brand_id'                => 'nullable|exists:brands,id',
            'collection_id'           => 'nullable|exists:collections,id',
            'images'                  => 'nullable|array',
            'colors'                  => 'nullable|array',
            'sizes'                   => 'nullable|array',
            'specifications'          => 'nullable|array',
            'is_featured'             => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']) . '-' . time();
        if (isset($validated['description'])) {
            $validated['description'] = clean($validated['description']);
        }
        $product = Product::create($validated);

        return response()->json($product->load(['category', 'brand', 'galleryImages']), 201);
    }

    public function show(Product $product)
    {
        return response()->json($product->load(['category', 'brand', 'galleryImages', 'approvedReviews.user:id,name']));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name'                    => 'string|max:255',
            'description'             => 'nullable|string',
            'meta_description'        => 'nullable|string|max:160',
            'tags'                    => 'nullable|array',
            'material'                => 'nullable|string',
            'weight'                  => 'nullable|string',
            'price'                   => 'numeric',
            'old_price'               => 'nullable|numeric',
            'stock'                   => 'integer',
            'stock_status'            => 'in:in_stock,out_of_stock,backorder',
            'backorder_available_date' => 'nullable|date',
            'backorder_message'        => 'nullable|string|max:255',
            'category_id'             => 'nullable|exists:categories,id',
            'brand_id'                => 'nullable|exists:brands,id',
            'collection_id'           => 'nullable|exists:collections,id',
            'images'                  => 'nullable|array',
            'colors'                  => 'nullable|array',
            'sizes'                   => 'nullable|array',
            'specifications'          => 'nullable|array',
            'is_featured'             => 'boolean',
        ]);
        if (isset($validated['name']) && $validated['name'] !== $product->name) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . time();
        }

        if (isset($validated['description'])) {
            $validated['description'] = clean($validated['description']);
        }

        $product->update($validated);

        return response()->json($product->load(['category', 'brand', 'galleryImages']));
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(null, 204);
    }

    public function export()
    {
        $products = Product::with('category')->get();
        $filename = "products_export_" . date('Y_m_d_H_i') . ".csv";

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['ID', 'Name', 'Slug', 'Category', 'Price', 'Old Price', 'Stock', 'Stock Status', 'Description'];

        $callback = function() use($products, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($products as $product) {
                fputcsv($file, [
                    $product->id,
                    $product->name,
                    $product->slug,
                    $product->category ? $product->category->name : '',
                    $product->price,
                    $product->old_price,
                    $product->stock,
                    $product->stock_status,
                    $product->description
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt'
        ]);

        $file = $request->file('file');
        $handle = fopen($file->path(), 'r');
        $header = true;
        $count = 0;

        while ($row = fgetcsv($handle, 1000, ',')) {
            if ($header) {
                $header = false;
                continue;
            }

            // Map columns: 0=ID, 1=Name, 2=Slug, 3=Category, 4=Price, 5=Old Price, 6=Stock, 7=Stock Status, 8=Description
            if (count($row) >= 9) {
                $productData = [
                    'name' => $row[1],
                    'slug' => $row[2] ?: Str::slug($row[1]) . '-' . time(),
                    'price' => is_numeric($row[4]) ? $row[4] : 0,
                    'old_price' => is_numeric($row[5]) ? $row[5] : null,
                    'stock' => is_numeric($row[6]) ? $row[6] : 0,
                    'stock_status' => in_array($row[7], ['in_stock', 'out_of_stock', 'backorder']) ? $row[7] : 'in_stock',
                    'description' => $row[8]
                ];

                if (!empty($row[0]) && is_numeric($row[0])) {
                    $product = Product::find($row[0]);
                    if ($product) {
                        $product->update($productData);
                    } else {
                        Product::create($productData);
                    }
                } else {
                    Product::create($productData);
                }
                $count++;
            }
        }
        fclose($handle);

        return response()->json(['message' => "$count products imported/updated successfully"]);
    }
}
