import { useState } from 'react'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

// Static import for all possible form components
import AutocompleteField from '@/components/dashboard-ui/AutocompleteField'
import ColorPickerField from '@/components/dashboard-ui/ColorPickerField'
import DateRangePickerField from '@/components/dashboard-ui/DateRangePickerField'
import DynamicSelectField from '@/components/dashboard-ui/DynamicSelectField'
import ImageUploadFieldSingle from '@/components/dashboard-ui/ImageUploadFieldSingle'
import ImageUploadManager from '@/components/dashboard-ui/ImageUploadManager'
import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail'
import InputFieldForPasscode from '@/components/dashboard-ui/InputFieldForPasscode'
import InputFieldForPassword from '@/components/dashboard-ui/InputFieldForPassword'
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString'
import JsonTextareaField from '@/components/dashboard-ui/JsonTextareaField'
import MultiCheckboxGroupField from '@/components/dashboard-ui/MultiCheckboxGroupField'
import MultiOptionsField from '@/components/dashboard-ui/MultiOptionsField'
import NumberInputFieldFloat from '@/components/dashboard-ui/NumberInputFieldFloat'
import NumberInputFieldInteger from '@/components/dashboard-ui/NumberInputFieldInteger'
import PhoneInputField from '@/components/dashboard-ui/PhoneInputField'
import RichTextEditorField from '@/components/dashboard-ui/RichTextEditorField'
import TextareaFieldForDescription from '@/components/dashboard-ui/TextareaFieldForDescription'
import TimeField from '@/components/dashboard-ui/TimeField'
import TimeRangePickerField from '@/components/dashboard-ui/TimeRangePickerField'
import UrlInputField from '@/components/dashboard-ui/UrlInputField'
import { BooleanInputField } from '@/components/dashboard-ui/BooleanInputField'
import { CheckboxField } from '@/components/dashboard-ui/CheckboxField'
import { DateField } from '@/components/dashboard-ui/DateField'
import { RadioButtonGroupField } from '@/components/dashboard-ui/RadioButtonGroupField'
import { SelectField } from '@/components/dashboard-ui/SelectField'

import StringArrayField from './others-field-type/StringArrayField'
import { StringArrayData } from './others-field-type/types';



import { usePostsStore } from '../store/store'
import { useAddPostsMutation } from '@/redux/features/posts/postsSlice'
import { IPosts, defaultPosts } from '../store/data/data'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const AddNextComponents: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, setPosts } = usePostsStore()
    const [addPosts, { isLoading }] = useAddPostsMutation()
    const [newPost, setNewPost] = useState<IPosts>(defaultPosts)

    const handleFieldChange = (name: string, value: unknown) => {
        setNewPost(prev => ({ ...prev, [name]: value }))
    }

    const handleAddPost = async () => {
        try {
            const updateData = { ...newPost }
            delete updateData._id
            if (updateData.students) {
                updateData.students = updateData.students.map((i: StringArrayData) => {
                    const r = { ...i }
                    delete r._id
                    return r
                })
            }
            const addedPost = await addPosts(updateData).unwrap()
            setPosts([addedPost])
            toggleAddModal(false)
            setNewPost(defaultPosts)
            handleSuccess('Added Successfully')
        } catch (error: unknown) {
            console.error('Failed to add record:', error)
            let errMessage: string = 'An unknown error occurred.'
            if (isApiErrorResponse(error)) {
                errMessage = formatDuplicateKeyError(error.data.message) || 'An API error occurred.'
            } else if (error instanceof Error) {
                errMessage = error.message
            }
            handleError(errMessage)
        }
    }

    const areaOptions = [
        { label: 'Bangladesh', value: 'Bangladesh' },
        { label: 'India', value: 'India' },
        { label: 'Pakistan', value: 'Pakistan' },
        { label: 'Canada', value: 'Canada' }
    ];

    const ideasOptions = [
        { label: 'O 1', value: 'O 1' },
        { label: 'O 2', value: 'O 2' },
        { label: 'O 3', value: 'O 3' },
        { label: 'O 4', value: 'O 4' }
    ];

    const shiftOptions = [
        { label: 'OP 1', value: 'OP 1' },
        { label: 'OP 2', value: 'OP 2' },
        { label: 'OP 3', value: 'OP 3' },
        { label: 'OP 4', value: 'OP 4' }
    ];

    return (
        <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
            <DialogContent
                className="sm:max-w-[825px] rounded-xl border mt-[35px] border-white/20 bg-white/10
                           backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-300 p-0"
            >
                <ScrollArea
                    className="h-[75vh] max-h-[calc(100vh-2rem)] rounded-xl"
                >
                    <DialogHeader className="p-6 pb-3">
                        <DialogTitle
                            className="text-xl font-semibold bg-clip-text text-transparent
                                       bg-gradient-to-r from-white to-blue-200 drop-shadow-md"
                        >
                            Add New Post
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4 px-6 text-white">
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="title" className="text-right ">
                                Title
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString className="text-white" id="title" placeholder="Title" value={newPost['title']} onChange={(value) => handleFieldChange('title', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="email" className="text-right ">
                                Email
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForEmail className="text-white" id="email" value={newPost['email']} onChange={(value) => handleFieldChange('email', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="password" className="text-right ">
                                Password
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForPassword id="password" value={newPost['password']} onChange={(value) => handleFieldChange('password', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="passcode" className="text-right ">
                                Passcode
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForPasscode id="passcode" value={newPost['passcode']} onChange={(value) => handleFieldChange('passcode', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="area" className="text-right ">
                                Area
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={areaOptions} value={newPost['area']} onValueChange={(value) => handleFieldChange('area', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="sub-area" className="text-right ">
                                Sub Area
                            </Label>
                            <div className="col-span-3">
                                <DynamicSelectField value={newPost['sub-area']} apiUrl='https://jsonplaceholder.typicode.com/users' onChange={(values) => handleFieldChange('sub-area', values)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="products-images" className="text-right ">
                                Products Images
                            </Label>
                            <div className="col-span-3">
                                <ImageUploadManager value={newPost['products-images']} onChange={(urls) => handleFieldChange('products-images', urls)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="personal-image" className="text-right ">
                                Personal Image
                            </Label>
                            <div className="col-span-3">
                                <ImageUploadFieldSingle value={newPost['personal-image']} onChange={(url) => handleFieldChange('personal-image', url)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pr-1">
                            <Label htmlFor="description" className="text-right pt-3">
                                Description
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription className="text-white" id="description" value={newPost['description']} onChange={(e) => handleFieldChange('description', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="age" className="text-right ">
                                Age
                            </Label>
                            <div className="col-span-3">
                                <NumberInputFieldInteger id="age" value={newPost['age']} onChange={(value) => handleFieldChange('age', value as number)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="amount" className="text-right ">
                                Amount
                            </Label>
                            <div className="col-span-3">
                                <NumberInputFieldFloat id="amount" value={newPost['amount']} onChange={(value) => handleFieldChange('amount', value as number)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="isActive" className="text-right ">
                                IsActive
                            </Label>
                            <div className="col-span-3">
                                <BooleanInputField id="isActive" checked={newPost['isActive']} onCheckedChange={(checked) => handleFieldChange('isActive', checked)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="start-date" className="text-right ">
                                Start Date
                            </Label>
                            <div className="col-span-3">
                                <DateField id="start-date" value={newPost['start-date']} onChange={(date) => handleFieldChange('start-date', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="start-time" className="text-right ">
                                Start Time
                            </Label>
                            <div className="col-span-3">
                                <TimeField id="start-time" value={newPost['start-time']} onChange={(time) => handleFieldChange('start-time', time)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="schedule-date" className="text-right ">
                                Schedule Date
                            </Label>
                            <div className="col-span-3">
                                <DateRangePickerField id="schedule-date" value={newPost['schedule-date']} onChange={(range) => handleFieldChange('schedule-date', range)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="schedule-time" className="text-right ">
                                Schedule Time
                            </Label>
                            <div className="col-span-3">
                                <TimeRangePickerField id="schedule-time" value={newPost['schedule-time']} onChange={(range) => handleFieldChange('schedule-time', range)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="favorite-color" className="text-right ">
                                Favorite Color
                            </Label>
                            <div className="col-span-3">
                                <ColorPickerField id="favorite-color" value={newPost['favorite-color']} onChange={(value) => handleFieldChange('favorite-color', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="number" className="text-right ">
                                Number
                            </Label>
                            <div className="col-span-3">
                                <PhoneInputField id="number" value={newPost['number']} onChange={(value) => handleFieldChange('number', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="profile" className="text-right ">
                                Profile
                            </Label>
                            <div className="col-span-3">
                                <UrlInputField id="profile" value={newPost['profile']} onChange={(value) => handleFieldChange('profile', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pr-1">
                            <Label htmlFor="test" className="text-right pt-3">
                                Test
                            </Label>
                            <div className="col-span-3">
                                <RichTextEditorField id="test" value={newPost['test']} onChange={(value) => handleFieldChange('test', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="info" className="text-right ">
                                Info
                            </Label>
                            <div className="col-span-3">
                                <AutocompleteField id="info" value={newPost['info']} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="shift" className="text-right ">
                                Shift
                            </Label>
                            <div className="col-span-3">
                                <RadioButtonGroupField options={shiftOptions} value={newPost['shift']} onChange={(value) => handleFieldChange('shift', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="policy" className="text-right ">
                                Policy
                            </Label>
                            <div className="col-span-3">
                                <CheckboxField id="policy" checked={newPost['policy']} onCheckedChange={(checked) => handleFieldChange('policy', checked)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pr-1">
                            <Label htmlFor="hobbies" className="text-right pt-3">
                                Hobbies
                            </Label>
                            <div className="col-span-3">
                                <MultiCheckboxGroupField value={newPost['hobbies']} onChange={(values) => handleFieldChange('hobbies', values)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="ideas" className="text-right ">
                                Ideas
                            </Label>
                            <div className="col-span-3">
                                <MultiOptionsField options={ideasOptions} value={newPost['ideas']} onChange={(values) => handleFieldChange('ideas', values)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pr-1">
                            <Label htmlFor="students" className="text-right pt-3">
                                Students
                            </Label>
                            <div className="col-span-3">
                                <StringArrayField value={newPost['students']} onChange={(value) => handleFieldChange('students', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4 pr-1">
                            <Label htmlFor="complexValue" className="text-right pt-3">
                                ComplexValue
                            </Label>
                            <div className="col-span-3">
                                <JsonTextareaField id="complexValue" value={(newPost['complexValue'] || '')} onChange={(value) => handleFieldChange('complexValue', value as string)} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter className="p-6 pt-4 gap-3">
                    <Button
                        variant="outlineWater"
                        onClick={() => toggleAddModal(false)}
                        size="sm"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleAddPost}
                        variant="outlineGarden"
                        size="sm"
                    >
                        {isLoading ? 'Adding...' : 'Add Post'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNextComponents
