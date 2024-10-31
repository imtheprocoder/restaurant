import { useEffect, useState } from 'react'
import classes from './foodsAdminPage.module.css'
import { Link, useParams } from 'react-router-dom';
import { deleteById, getAll, search } from '../../services/foodService';
import NotFound from '../../components/NotFound/NotFound';
import Title from '../../components/Title/Title';
import Search from '../../components/Search/Search';
import Price from '../../components/Price/Price';
import { toast } from 'react-toastify';

export default function FoodsAdminPage() {
    const [foods, setFoods] = useState();
    const {searchTerm} = useParams();

    useEffect(() => {
        loadFoods();
    }, [searchTerm]);

    const loadFoods = async () => {
        const foods = searchTerm ? await search(searchTerm) : await getAll();
        setFoods(foods);
    }

    const FoodsNotFound = () => {
        if(foods && foods.length > 0) return;

        return searchTerm? (
        <NotFound linkRoute="/admin/foods" linkText="Visa Alla" />
            ): (
                <NotFound linkRoute="/dashboard" linkText="Tillbaka till dashboard" />

            )
    }

    const deleteFood = async food => {
        const confirmed = window.confirm(`Radera Mat ${food.name}?`);
        if(!confirmed) return;

        await deleteById(food.id);

        toast.success(`"${food.name}" Har Raderats`);

        setFoods(foods.filter(f => f.id !== food.id));
    }

  return (
  <div className={classes.container}>
    <div className={classes.list}>
        <Title title="Hantera Mat" margin="1rem auto" />
        <Search 
        searchRoute="/admin/foods/"
        defaultRoute="/admin/foods"
        placeholder="Sök Mat"
        margin="1rem 0"
        />
        <Link to="/admin/addFood" className={classes.add_food}>
            Lägg Till Mat +
        </Link>
        <FoodsNotFound />
        {
            foods &&
            foods.map(food => (
            <div key={food.id} className={classes.list_item}>
                <img src={food.imageUrl} alt={food.name} />
                <Link to={'/food/' + food.id}>{food.name}</Link>
                <Price price={food.price} />
                <div className={classes.actions}>
                    <Link to={'/admin/editFood/' + food.id}>Ändra</Link>
                    <Link onClick={() => deleteFood(food)}>Radera</Link>
                </div>
            </div>
            ))
        }
    </div>
  </div>
  )
}
