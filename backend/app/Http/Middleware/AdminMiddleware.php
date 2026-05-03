<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $allowedRoles = ['admin', 'developer', 'finance', 'stock_agent', 'delivery_rider'];
        
        if ($request->user() && in_array($request->user()->role, $allowedRoles)) {
            return $next($request);
        }

        return response()->json(['message' => 'Unauthorized. Staff access required.'], 403);
    }
}
