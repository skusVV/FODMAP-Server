import { capitalise } from "./normalisation.service.js";

export default class IngredientService {

    constructor(sql) {
        this.sql = sql;
    }


    async uploadNewIngredient(ingredient, res) {

        try {
            console.log('New ingredient upload triggered');
    
            const {name, detail, category} = ingredient;

            await this.sql`
                    INSERT INTO ingredients
                        (ingredient_name, ingredient_detail, ingredient_category)
                    VALUES
                        (${capitalise(name)}, ${capitalise(detail)}, ${category})
                `

            res.status(201).json({ saved_data: ingredient });
            console.log(`${capitalise(name)} ${capitalise(detail)} added successfully to database`);
            
        } catch (error) {
            console.error('Error inserting data:', error);
            res.status(500).json({"Unable to save data to database": error});
        }
        
    };

    async updateIngredient(ingredient, res) {

        try {
            console.log('Ingredient update triggered');
    
            const {id, name, detail, category} = ingredient;
            const updatedIngredient = {
                ingredient_name: capitalise(name),
                ingredient_detail: capitalise(detail),
                ingredient_category: category
            }

            await this.sql`
                UPDATE ingredients
                SET ${
                    this.sql(updatedIngredient, 'ingredient_name', 'ingredient_detail', 'ingredient_category')
                }
                WHERE ingredient_id = ${ id }
            `

            res.status(201).json({ updated_data: updatedIngredient });
            console.log(`Database updated successfully for ${id}: ${capitalise(name)}`);

        } catch (error) {
            console.error('Error inserting data:', error);
            res.status(500).json({"Unable to save data to database": error});
        }

    }
    
}
