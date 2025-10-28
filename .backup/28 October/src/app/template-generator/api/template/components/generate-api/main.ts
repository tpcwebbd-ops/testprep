import generateController from './generate-controller'
import writeInFile from '../create-and-write'
import { generateModel } from './generate-model'
import { generateRoute } from './generate-route'
import { generateSummaryController } from './summary/generate-controller'
import { generateSummaryRoute } from './summary/generate-route'

const generateApi = async (data: string) => {
    let folderName = 'example'
    let isUseGenerateFolder = false
    const { namingConvention } = JSON.parse(data) || {}
    if (namingConvention.users_2_000___) {
        folderName = namingConvention.users_2_000___
        isUseGenerateFolder = namingConvention.use_generate_folder
    }

    if (isUseGenerateFolder) {
    } else {
    }

    const controllerTemplate = generateController(data)
    const medelTemplate = generateModel(data)
    const routeTemplate = generateRoute(data)
    const sumaryRouteTemplate = generateSummaryRoute(data)
    const summaryControllerTemplate = generateSummaryController(data)

    if (isUseGenerateFolder) {
        writeInFile(
            controllerTemplate,
            `src/app/generate/${folderName}/all/api/v1/controller.ts`
        )
        writeInFile(
            medelTemplate,
            `src/app/generate/${folderName}/all/api/v1/model.ts`
        )
        writeInFile(
            routeTemplate,
            `src/app/generate/${folderName}/all/api/v1/route.ts`
        )

        writeInFile(
            sumaryRouteTemplate,
            `src/app/generate/${folderName}/all/api/v1/summary/route.ts`
        )
        writeInFile(
            summaryControllerTemplate,
            `src/app/generate/${folderName}/all/api/v1/summary/controller.ts`
        )
    } else {
        writeInFile(
            controllerTemplate,
            `src/app/api/${folderName}/v1/controller.ts`
        )
        writeInFile(medelTemplate, `src/app/api/${folderName}/v1/model.ts`)
        writeInFile(routeTemplate, `src/app/api/${folderName}/v1/route.ts`)

        writeInFile(
            sumaryRouteTemplate,
            `src/app/api/${folderName}/v1/summary/route.ts`
        )
        writeInFile(
            summaryControllerTemplate,
            `src/app/api/${folderName}/v1/summary/controller.ts`
        )
    }
}
export default generateApi
