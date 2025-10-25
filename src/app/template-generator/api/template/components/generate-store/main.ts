import writeInFile from '../create-and-write'
import { generateStoreData } from './data/generate-store-data'
import generateStoreFile from './generate-store'
import generateStoreConstant from './generate-store-constant'
import generateStoreTypeFile from './generate-store-type'

const generateStore = async (data: string) => {
    let folderName = 'example'
    let isUseGenerateFolder = false
    const { namingConvention } = JSON.parse(data) || {}
    if (namingConvention.users_2_000___) {
        folderName = namingConvention.users_2_000___
        isUseGenerateFolder = namingConvention.use_generate_folder
    }

    const storeTemplate = generateStoreFile(data)
    const storeConstantTemplate = generateStoreConstant(data)
    const storeTypeTemplate = generateStoreTypeFile(data)
    const storeDataTemplate = generateStoreData(data)

    if (isUseGenerateFolder) {
        writeInFile(
            storeTemplate,
            `src/app/generate/${folderName}/all/store/store.ts`
        )
        writeInFile(
            storeConstantTemplate,
            `src/app/generate/${folderName}/all/store/store-constant.ts`
        )
        writeInFile(
            storeTypeTemplate,
            `src/app/generate/${folderName}/all/store/store-type.ts`
        )
        writeInFile(
            storeDataTemplate,
            `src/app/generate/${folderName}/all/store/data/data.ts`
        )
    } else {
        writeInFile(
            storeTemplate,
            `src/app/dashboard/${folderName}/all/store/store.ts`
        )
        writeInFile(
            storeConstantTemplate,
            `src/app/dashboard/${folderName}/all/store/store-constant.ts`
        )
        writeInFile(
            storeTypeTemplate,
            `src/app/dashboard/${folderName}/all/store/store-type.ts`
        )
        writeInFile(
            storeDataTemplate,
            `src/app/dashboard/${folderName}/all/store/data/data.ts`
        )
    }
}
export default generateStore
