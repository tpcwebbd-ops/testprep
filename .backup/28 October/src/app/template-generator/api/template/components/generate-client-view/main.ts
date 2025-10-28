import writeInFile from '../create-and-write'
import { generateIDHomeButton } from './generate-[id]-home-button'
import { generateClientDetailPageFile } from './generate-[id]-page'
import { generateCustomButton } from './generate-custom-button'
import { generateClientListPageFile } from './generate-main-page'

const generateClientView = async (data: string) => {
    let folderName = 'example'
    let isUseGenerateFolder = false
    const { namingConvention } = JSON.parse(data) || {}
    if (namingConvention.users_2_000___) {
        folderName = namingConvention.users_2_000___
        isUseGenerateFolder = namingConvention.use_generate_folder
    }

    const mainPageTemplate = generateClientListPageFile(data)
    const custombuttonTemplate = generateCustomButton()
    const idHomeButtonTemplate = generateIDHomeButton(data)
    const detailPageTemplate = generateClientDetailPageFile(data)

    if (isUseGenerateFolder) {
        writeInFile(
            mainPageTemplate,
            `src/app/generate/${folderName}/client-view/page.tsx`
        )
        writeInFile(
            custombuttonTemplate,
            `src/app/generate/${folderName}/client-view/CustomButton.tsx`
        )
        writeInFile(
            idHomeButtonTemplate,
            `src/app/generate/${folderName}/client-view/details/[id]/HomeButton.tsx`
        )
        writeInFile(
            detailPageTemplate,
            `src/app/generate/${folderName}/client-view/details/[id]/page.tsx`
        )
    } else {
        writeInFile(
            mainPageTemplate,
            `src/app/dashboard/${folderName}/client-view/page.tsx`
        )
        writeInFile(
            custombuttonTemplate,
            `src/app/dashboard/${folderName}/client-view/CustomButton.tsx`
        )
        writeInFile(
            idHomeButtonTemplate,
            `src/app/dashboard/${folderName}/client-view/details/[id]/HomeButton.tsx`
        )
        writeInFile(
            detailPageTemplate,
            `src/app/dashboard/${folderName}/client-view/details/[id]/page.tsx`
        )
    }
}
export default generateClientView
