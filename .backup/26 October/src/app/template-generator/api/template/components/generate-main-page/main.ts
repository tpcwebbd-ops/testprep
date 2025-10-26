import writeInFile from '../create-and-write'
import { generateMainPageFile } from './generate-main-page'

const generateMainPage = async (data: string) => {
    let folderName = 'example'
    let isUseGenerateFolder = false
    const { namingConvention } = JSON.parse(data) || {}
    if (namingConvention.users_2_000___) {
        folderName = namingConvention.users_2_000___
        isUseGenerateFolder = namingConvention.use_generate_folder
    }

    const mainPageTemplate = generateMainPageFile(data)

    if (isUseGenerateFolder) {
        writeInFile(
            mainPageTemplate,
            `src/app/generate/${folderName}/all/page.tsx`
        )
    } else {
        writeInFile(
            mainPageTemplate,
            `src/app/dashboard/${folderName}/all/page.tsx`
        )
    }
}
export default generateMainPage
