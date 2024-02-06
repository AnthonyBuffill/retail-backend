const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const allProducts = await Product.findAll({
      include: [
        { model: Category },
        { model: Tag, through: ProductTag },
      ],
    });
    return res.json(allProducts);
  } 
    catch (error) {
    return res.status(500).json({ error: 'Internal error, sorry' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId, {
      include: [
        { model: Category },
        { model: Tag, through: ProductTag },
      ],
    });
    res.json(product);
  } 
    catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal error, sorry' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { product_name, price, stock, tagIds } = req.body;

    if (!product_name || !price || !stock || !Array.isArray(tagIds)) {
      return res.status(400).json({ error: 'Invalid request body structure' });
    }
    const product = await Product.create({
      product_name,
      price,
      stock,
    });

    if (tagIds.length) {
      const productTagIdArr = tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }
    const products =  await Product.findAll();
    res.status(200).json(products);
  } 
    catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.put('/:id', async (req, res) => {
  try {
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

        const productTagIds = productTags.map(({ tag_id }) => tag_id);
        const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

        const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);

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
    } 
      else {
      return res.status(404).json({ error: 'Product not found' });
    }
  } 
    catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Product not found or update failed' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (deletedProduct) {
      const products =  await Product.findAll();
      res.status(200).json(products);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal error, sorry' });
  }
});

module.exports = router;
