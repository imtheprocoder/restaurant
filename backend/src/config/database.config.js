import { connect, set } from "mongoose";
import { UserModel } from "../models/user.model.js";
import { FoodModel } from "../models/food.model.js";
import { sample_users } from "../data.js";
import { sample_foods } from "../data.js";
import bcrypt from 'bcryptjs';

const PASSWORD_HASH_SALT_ROUNDS = 10;

set('strictQuery', true);

export const dbconnect = async () => {
    try{
        connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        await seedUsers();
        await seedFoods();
        console.log('Connected successfully to database');
    }
    catch(error){
        console.log('Error connecting to database: ', error);
    }
}

async function seedUsers(){
    const userCount = await UserModel.countDocuments();
    if(userCount > 0){
        console.log('Users already seeded');
        return;
    }

    for(let user of sample_users){
        user.password = await bcrypt.hash(user.password, PASSWORD_HASH_SALT_ROUNDS);
        await UserModel.create(user);
    }

    console.log('Users seeded successfully');
}

async function seedFoods(){
    const foods = await FoodModel.countDocuments();
    if(foods > 0){
        console.log('Foods already seeded');
        return;
    }

    for(const food of sample_foods) {
        food.imageUrl = `/foods/${food.imageUrl}`;
        await FoodModel.create(food);
    }

    console.log('Foods seeded successfully');
}