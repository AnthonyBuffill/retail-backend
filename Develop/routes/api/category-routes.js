const router = require('express').Router();
const { Category, Product } = require('../../models');



router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: Product,
    });
    res.json(categories);
  } 
    catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findByPk(categoryId, {
      include: Product,
    });
    res.json(category);
  } 
    catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    await Category.create(req.body);
    const categories = await Category.findAll();
    res.json(categories);
  } 
    catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const categoryToUpdate = await Category.findByPk(categoryId);
   
  if (categoryToUpdate) {
    const updatedCategory = await categoryToUpdate.update(req.body);
    res.json(updatedCategory);
    } 
     else {
      res.status(404).json({ error: 'Category not found' });
    }
  } 
    catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    await Category.destroy({
      where: { id: categoryId },
    });
    
    const cats = await Category.findAll();
    res.json(cats);
  } 
    catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

