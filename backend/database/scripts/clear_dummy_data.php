<?php

use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Models\HomepageSection;
use App\Models\HomepageSectionItem;
use App\Models\ProductReview;

// Clear dummy products and related data
echo "Clearing dummy data...\n";

// These are known dummy identifiers from setup
$dummyKeywords = ['Voltix', 'Neocore', 'URAIR Executive', 'Uria Lasp', 'Tech Dock'];

foreach ($dummyKeywords as $keyword) {
    Product::where('name', 'like', "%$keyword%")->delete();
}

// Clear specific sections that are often dummy
HomepageSectionItem::where('title', 'like', '%Voltix%')
    ->orWhere('subtitle', 'like', '%Voltix%')
    ->delete();

// Clear reviews that look dummy
ProductReview::where('author_name', 'James L.')->delete();

echo "Dummy data cleared.\n";
