-   Create validators [X]
-   Maybe add search for Snippets
-   In Login Route, Fix the Validation to return Auth Error
-   Create separate table for Category

## Explore the Idea:

> We can't make multi page of a single `tag` under a single `category`. And making single page will be hassle when it comes to edit. So:

-   Check if it will be better if we make section type. Like, under a `category` will be a single specific `tag` page (/frontend/react).
-   But to make the Edit and Manage easier, we can split the page in sections. Each `section` is manageable separately, but, will be rendered under same `tag` in same page.
-   This way we can use the section titles as `Table of Contents`
-   We can also explore the possibility of Sub-`Table of Contents`
