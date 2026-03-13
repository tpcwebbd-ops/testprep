import generateAllOtherComponentsMain from './others-component/main'
import generateRichTextEditorMain from './rich-text-editor/main'
import generateViewRichTextEditorMain from './view-rich-text-editor/main'

const generateAllOtherComponents = async (data: string) => {
    generateRichTextEditorMain(data)
    generateViewRichTextEditorMain(data)
    generateAllOtherComponentsMain(data)
}
export default generateAllOtherComponents
