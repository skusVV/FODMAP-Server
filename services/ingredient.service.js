import { capitalise } from "./normalisation.service.js";

export default class IngredientService {

    constructor(sql) {
        this.sql = sql;
    }


    async uploadIngredientData(ingredient, res) {

        try {
            console.log('New ingredient upload triggered');
    
            const {name, detail, category} = ingredient;

            await this.sql`
                    INSERT INTO test_ingredients
                        (ingredient_name, ingredient_detail, ingredient_category)
                    VALUES
                        (${capitalise(name)}, ${capitalise(detail)}, ${category})
                `

            res.status(201).json({ saved_data: ingredient });
            console.log('Data added successfully to database');
            
        } catch (error) {
            console.error('Error inserting data:', error);
            res.status(500).json({"Unable to save data to database": error});
        }
        
    };
    
}
