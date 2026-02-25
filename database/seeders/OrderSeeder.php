<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        foreach ($users as $user) {
            for ($i = 0; $i < rand(1, 3); $i++) {
                $order = Order::create([
                    'user_id' => $user->id,
                    'status' => ['pending', 'completed', 'cancelled'][rand(0, 2)],
                    'payment_method' => 'cash',
                    'payment_status' => ['pending', 'completed', 'cancelled'][rand(0, 2)],
                ]);
                for ($j = 0; $j < rand(1, 3); $j++) {
                    $orderItem = OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => Product::all()->random()->id,
                        'quantity' => rand(1, 3),
                        'price' => Product::all()->random()->price,
                        'total_amount' => Product::all()->random()->price * rand(1, 3),
                    ]);
                }
                $order->total_amount = $order->orderItems->sum('total_amount');
                $order->save();
            }
        }
    }
}
