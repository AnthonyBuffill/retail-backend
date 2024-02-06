const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    // Find all categories and include associated Products
    const categories = await Category.findAll({
      include: Product,
    });

    // Send the categories as a JSON response
    res.json(categories);
  } catch (error) {
    // Handle any errors that occur during the query
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // Find one category by its `id` value and include associated Products
    const categoryId = req.params.id;
    const category = await Category.findByPk(categoryId, {
      include: Product,
    });

    // Send the category as a JSON response
    res.json(category);
  } catch (error) {
    // Handle any errors that occur during the query
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    // Create a new category
    const newCategory = await Category.create(req.body);

    // Send the newly created category as a JSON response
    res.json(newCategory);
  } catch (error) {
    // Handle any errors that occur during the creation
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    // Update a category by its `id` value
    const categoryId = req.params.id;
    
    // Find the category by its primary key
    const categoryToUpdate = await Category.findByPk(categoryId);

    if (categoryToUpdate) {
      // Update only the specified fields from req.body
      const updatedCategory = await categoryToUpdate.update(req.body);

      // Send a success message or the updated category as a JSON response
      res.json(updatedCategory);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    // Handle any errors that occur during the update
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // Delete a category by its `id` value
    const categoryId = req.params.id;
    await Category.destroy({
      where: { id: categoryId },
    });

    // Send a success message or the deleted category as a JSON response
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    // Handle any errors that occur during the deletion
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

