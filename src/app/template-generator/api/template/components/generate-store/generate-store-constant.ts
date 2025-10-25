interface Schema {
    [key: string]: string | Schema
}


interface NamingConvention {
    Users_1_000___: string
    users_2_000___: string
    User_3_000___: string
    user_4_000___: string
}


interface InputConfig {
    uid: string
    templateName: string
    schema: Schema
    namingConvention: NamingConvention
}


const generateStoreConstant = (inputJson: string): string => {
    const config: InputConfig = JSON.parse(inputJson)
    const { namingConvention } = config

    const pluralLowerCase = namingConvention.users_2_000___ // e.g., "posts"
    const result = `
    export const defaultPageNumber = 2;
export const queryParams = { q: '', page: 1, limit: defaultPageNumber };
export const pageLimitArr = [defaultPageNumber, 20, 30, 40, 50];
export const  ${pluralLowerCase}SelectorArr  = ['Store Post 1', 'Store Post 2', 'Store Post 3'];

    `
    return result
}

export default generateStoreConstant
