Look at those code carefully.
1. Api  
   - /src/api/page-builder/v1/controller.ts
   - /src/api/page-builder/v1/model.ts
   - /src/api/page-builder/v1/route.ts

2. Redux/Slice
    - src/redux/features/page-builder/pageBuilderSlice.ts 

3. Page-builder 
    - /src/dashboard/page-builder/utils.ts
    - /src/dashboard/page-builder/page.tsx
    - /src/dashboard/page-builder/edit-page/page.tsx
    - /src/dashboard/page-builder/form-data/page.tsx
    - /src/dashboard/page-builder/preview-page/page.tsx

4. Componnets
    - /src/components/all-sectoins/all-section-index/all-sections.tsx
    - /src/components/all-sectoins/section-1/data.ts
    - /src/components/all-sectoins/section-1/Mutation.tsx
    - /src/components/all-sectoins/section-1/Query.tsx
    - /src/components/all-sectoins/section-2/data.ts
    - /src/components/all-sectoins/section-2/Mutation.tsx
    - /src/components/all-sectoins/section-2/Query.tsx

Main Problem: in future there are more then 1000 components in all-sections. and If I create more then 1000 project it will huge code base. 

My Idea: I will create 2 Project named 1. Parent-project[where 1000 components is writen] and another is 2. child project[it can fetch components from parent project and render it.]

Now Your task is find a better idea to implement the code and render it. Also Please give me some idea if there is a better options. And also give me instruction how to implement it in my project. 