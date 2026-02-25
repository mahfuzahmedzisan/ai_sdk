<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 0; $i < 10; $i++) {
            Product::create([
                'name' => 'Product ' . $i,
                'description' => 'Description ' . $i,
                'price' => rand(1000, 10000),
                'slug' => 'product-' . $i,
                'image' => 'image-' . $i . '.jpg',
            ]);
        }
    }
}
