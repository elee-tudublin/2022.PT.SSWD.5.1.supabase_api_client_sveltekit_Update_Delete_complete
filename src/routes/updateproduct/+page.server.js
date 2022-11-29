// Import sveltekit dependencies
// @ts-ignore
import { invalid, redirect, error } from "@sveltejs/kit";

import { GetProductById, updateProduct } from '../../stores/productsStore';


// Refresh the store when page loads (optional due to overhead but probably a good idea)
/** @type {import('./$types').PageServerLoad} */
export const load = async ({url}) => {

  const id = url?.searchParams.get('id');
    
    if (id)  {
        let product;
        console.log('id: ', id);
        product = await GetProductById(id)

        return {
                product: product
            }
    }
}

// The form action handler(s)
export const actions = {

    // This is where the form sends its data
    // @ts-ignore
    update_product: async ({request }) => {
      // @ts-ignore
      let success = false;
  
      // get data from the request
      const form_data = await request.formData();
  
      // read each value
      const product = {
        id: Number(form_data.get('id')),
        category_id: Number(form_data.get('category_id')),
        product_name: form_data.get('product_name'),
        product_description: form_data.get('product_description'),
        product_stock: Number(form_data.get('product_stock')),
        product_price: Number(form_data.get('product_price'))
      }
  
      // Basic validation check
      if (
          product.id > 0 &&
          product.category_id > 0 &&
          product.product_name != '' &&
          product.product_description != '' &&
          product.product_stock > 0 &&
          product.product_price > 0
      ) {
          // Add the new product to Supabase
          const result = await updateProduct(product);
  
        // If validation passed - return the result
        // This is a JS object containing the success state, a message, and a copy of the newly added product (from Supabase)
        return { 
          success: true,
          // The following annotation is to ignore TypeScript Syntax errors detected by ESLint and the Svelte VS Code extensions
          // @ts-ignore
          message: `New product added with id: ${result.id}`,
          // @ts-ignore
          product: result
        };
        // If va;idation failed
        // Return a response with Status 400
        // set error state, a message, and return product (a copy of the form data) 
      } else {
        return invalid(400, {
          error: true,
          message: 'validation failed',
          product: product
        })
      }
    }
  
  };