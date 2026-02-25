<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\CategoryProduct;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategoryProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::all();
        $categories = Category::all();
        foreach ($products as $product) {
            for ($i = 0; $i < rand(1, 3); $i++) {
                CategoryProduct::create([
                    'product_id' => $product->id,
                    'category_id' => $categories->random()->id,
                ]);
            }
        }
    }
}
