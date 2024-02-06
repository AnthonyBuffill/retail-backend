const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const allProducts = await Product.findAll({
      include: [
        { model: Category },
        { model: Tag, through: ProductTag },
      ],
    });
    return res.json(allProducts);
  } catch (error) {
    return res.status(500).json({ error: 'Internal error, sorry' });
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category },
        { model: Tag, through: ProductTag },
      ],
    });
    if (product) {
      return res.status(200).json(product);
    } else {
      return res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal error, sorry' });
  }
});

// create new product
router.post('/', async (req, res) => {
  try {
    // Validate the structure of req.body
    const { product_name, price, stock, tagIds } = req.body;

    if (!product_name || !price || !stock || !Array.isArray(tagIds)) {
      // If any required property is missing, respond with a bad request
      return res.status(400).json({ error: 'Invalid request body structure' });
    }

    // Create the product
    const product = await Product.create({
      product_name,
      price,
      stock,
    });

    // If there are product tags, create pairings in the ProductTag model
    if (tagIds.length) {
      const productTagIdArr = tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }

    // Respond with the created product
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// update product
router.put('/:id', async (req, res) => {
  try {
    // update product data
    const [updatedRows] = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (updatedRows > 0) {
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTags = await ProductTag.findAll({
          where: { product_id: req.params.id },
        });

        // create filtered list of new tag_ids
        const productTagIds = productTags.map(({ tag_id }) => tag_id);
        const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

        // figure out which ones to remove
        const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);

        // run both actions
        await Promise.all([
          ProductTag.destroy({ where: { id: productTagsToRemove } }),
          ProductTag.bulkCreate(newProductTags),
        ]);
      }

      const updatedProduct = await Product.findByPk(req.params.id, {
        include: [
          { model: Category },
          { model: Tag, through: ProductTag },
        ],
      });

      return res.json(updatedProduct);
    } else {
      return res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Product not found or update failed' });
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const deletedProduct = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (deletedProduct) {
      res.json(deletedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal error, sorry' });
  }
});

module.exports = router;
