<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('genres', function (Blueprint $table) {
            $table->id(); // primary key
            $table->string('name');
            $table->foreignId('parent_id')->nullable()->constrained('genres')->nullOnDelete();
            $table->string('image')->nullable(); // <-- add this line for image path
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('genres');
    }
};
