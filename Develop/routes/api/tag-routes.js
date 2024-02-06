const router = require('express').Router();
const { Tag, Product } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock'], 
      },
    });

    res.json(tags);
  } 
    catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;
    const tag = await Tag.findOne({
      where: { id: tagId },
      include: {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock'], // Include only necessary attributes
      },
    });

    res.json(tag);
  } 
    catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.json(newTag);
  } 
    catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;
    const tagToUpdate = await Tag.findByPk(tagId);

    if (tagToUpdate) {
      const updatedTag = await tagToUpdate.update(req.body);
      res.json(updatedTag);
    } 
      else {
      res.status(404).json({ error: 'Tag not found' });
    }
  } 
    catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;
    const deletedTagCount = await Tag.destroy({
      where: { id: tagId },
    });

    if (deletedTagCount > 0) {
      const tags =  await Tag.findAll();
      res.json(tags);
    } 
      else {
      res.status(404).json({ error: 'Tag not found' });
    }
  } 
    catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
