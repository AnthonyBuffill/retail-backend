const router = require('express').Router();
const { Tag, Product } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    // Find all tags and include associated Product data
    const tags = await Tag.findAll({
      include: {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock'], // Include only necessary attributes
      },
    });

    // Send the tags as a JSON response
    res.json(tags);
  } catch (error) {
    // Handle any errors that occur during the query
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // Find a single tag by its `id` and include associated Product data
    const tagId = req.params.id;
    const tag = await Tag.findOne({
      where: { id: tagId },
      include: {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock'], // Include only necessary attributes
      },
    });

    // Send the tag as a JSON response
    res.json(tag);
  } catch (error) {
    // Handle any errors that occur during the query
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    // Create a new tag
    const newTag = await Tag.create(req.body);

    // Send the newly created tag as a JSON response
    res.json(newTag);
  } catch (error) {
    // Handle any errors that occur during the creation
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    // Update a tag's name by its `id` value
    const tagId = req.params.id;
    const tagToUpdate = await Tag.findByPk(tagId);

    if (tagToUpdate) {
      const updatedTag = await tagToUpdate.update({ name: req.body.name });

      // Send a success message or the updated tag as a JSON response
      res.json(updatedTag);
    } else {
      res.status(404).json({ error: 'Tag not found' });
    }
  } catch (error) {
    // Handle any errors that occur during the update
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // Delete a tag by its `id` value
    const tagId = req.params.id;
    const deletedTagCount = await Tag.destroy({
      where: { id: tagId },
    });

    if (deletedTagCount > 0) {
      // Send a success message
      res.json({ message: 'Tag deleted successfully' });
    } else {
      res.status(404).json({ error: 'Tag not found' });
    }
  } catch (error) {
    // Handle any errors that occur during the deletion
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
