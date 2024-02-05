const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    // Find all tags and include associated Product data
    const tags = await Tag.findAll({
      include: Product,
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
    const tag = await Tag.findByPk(tagId, {
      include: Product,
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
    const updatedTag = await Tag.update({ name: req.body.name }, {
      where: { id: tagId },
    });

    // Send a success message or the updated tag as a JSON response
    res.json(updatedTag);
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
    await Tag.destroy({
      where: { id: tagId },
    });

    // Send a success message or the deleted tag as a JSON response
    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    // Handle any errors that occur during the deletion
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

