Look at the dashboard/enrollments/page.tsx
```

```

api/enrollments/controller.ts
```

```
api/enrollments/model.ts
```

```
api/enrollments/route.ts
```

```

redux/enrollmentsSlice.ts
```

```


Now your task is update dashboard/enrollments/page.tsx with the following instructions.
1. At the top right side there is a button for add.
2. after that there is a summery section and if I click one of them then it will filter by those data (30 day, 7 day, all day).
    - last month (last 30 days)
    - last week (last 7 days)
    - total (life time)
3. after that there is a table sections.
    - first there is a search box. 
    - options for column [view or hide options]
    - export options 
    - bulk update and delete options.
    - bulk select options.
    - each item can be editable, deletable.
    - botton there is a pagination.
    - and select data per page, (10-500)