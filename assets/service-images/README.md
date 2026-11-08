# Software Services artwork

Ten approved, optimized WebP images generated with imagegen for the five services.
Night: smoked black glass and crimson accents. Light: white frosted glass and red accents.

After deploying the schema migration, run `npm run db:service-images` once against the intended database, or upload the files through Admin > Software Services. This command creates only missing service image records; it never overwrites an existing record, including deliberately removed images. It does not touch products or orders.

Git does not transfer local database contents. Do not run the product seed just to install these images.
