Help me to write a prompt.

I am working with NextJS with Typescript.

Now I want to build a page-builder. Here is description of the project. 

I need two utils for page-builder.
    1. all-sections
        - there is a list of sections with Mutation Component and Client component. 
        - a default data That I Want to use for both Mutation and Client component.


    2. all-icons
        - there is a list of i con I can choose from them.

there is two part 
1. Admin section.
    1. layout.tsx 
        - there is a sidebar and here is the list.
            - Admin 
            - Home 
            - (All page title)
    2. Admin.tsx: 
        - there is can see all my dynamic pages. at the top right side of the page there is a add Page button. 
        - each page have edit, delete, and view option. 

    2. page.tsx 
        - There I can edit the page data for home page. Here I want to use Mutation Component and can select icon from all icons.

    3. /edit/page.tsx
        - get parems and render the editable page for edit the page data. Here I want to use Mutation Component and can select icon from all icons.


2. Client Section (all page must be SSR)
    1.  page.tsx 
        - render home page. render Client component and render icon from all-icons
    2. make a dynamic route 
        - render each page. render Client component and render icon from all-icons