const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async(req, res) => {
  try {
    const allProducts = await Product.findAll({
      include: [
        { model: Catetory },
        { model: Tag, through: ProductTag },
      ],
    });
    return req.json(allProducts);
  } catch (error) {
    return res.status(500).json({error: 'internal error sorry'});
  }
  // find all products
  // be sure to include its associated Category and Tag data
});

// get one product
router.get('/:id', async(req, res) => {
  try{
    const product = await product.FindByPk({
      include: [
        {model: Category},
        {model: Tag, through: ProductTag },
      ],
    });
    return req.status(200).json(product);
  } catch (error){
    return req.status(404).json({error: 'product not found'});

  }
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
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
    const product = await Product.create(
      {
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
      tag_Id: req.body.tag_Id
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
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
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
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err,'Product not found');
    });
});

router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
  Product.destroy({
    where: {
      product_id: req.params.book_id,
    },
  })
    .then((deletedProduct) => {
      res.json(deletedProduct);
    })
    .catch((err) => res.json(err, 'product not found'));
});


module.exports = router;
