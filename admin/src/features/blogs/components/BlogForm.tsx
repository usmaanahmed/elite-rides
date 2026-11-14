import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save, Star } from 'lucide-react'
import { useState, type ChangeEvent, type FocusEvent } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Link } from 'react-router'
import { Button } from '../../../shared/components/buttons/Button'
import { Card } from '../../../shared/components/cards/Card'
import { Alert } from '../../../shared/components/feedback/Alert'
import { FormField } from '../../../shared/components/forms/FormField'
import { FormSection } from '../../../shared/components/forms/FormSection'
import { SegmentedControl } from '../../../shared/components/inputs/SegmentedControl'
import { Switch } from '../../../shared/components/inputs/Switch'
import { TextArea } from '../../../shared/components/inputs/TextArea'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import { PageHeader } from '../../../shared/components/PageHeader'
import { ROUTES } from '../../../shared/constants/routes'
import { useAddBlog, useEditBlog, useUploadBlogImage } from '../hooks/useBlogs'
import {
  AUTHOR_MAX_LENGTH,
  blogFormSchema,
  CATEGORY_MAX_LENGTH,
  EXCERPT_MAX_LENGTH,
  META_DESCRIPTION_IDEAL_LENGTH,
  META_DESCRIPTION_MAX_LENGTH,
  META_TITLE_IDEAL_LENGTH,
  META_TITLE_MAX_LENGTH,
  SLUG_MAX_LENGTH,
  TITLE_MAX_LENGTH,
} from '../schemas/blogFormSchema'
import type { Blog, BlogFormValues, BlogStatus, NewBlog } from '../types/blog'
import { formatBlogDate } from '../utils/formatBlogDate'
import { makeSlug } from '../utils/makeSlug'
import { BlogCharacterCounter } from './BlogCharacterCounter'
import { BlogCoverImageInput } from './BlogCoverImageInput'
import { BlogSeoPreview } from './BlogSeoPreview'
import { BlogTagsInput } from './BlogTagsInput'
import { RichTextEditor } from './editor/RichTextEditor'

type BlogFormProps = {
  // The blog being edited. null means a new blog is being written.
  blogToEdit: Blog | null
  // Categories other blogs already use, offered as suggestions
  categorySuggestions: string[]
  // Called with the saved blog after it has been added or updated
  onSaved: (blog: Blog, wasEdit: boolean) => void
}

// Lets the Save buttons outside the <form> (in the page header) submit it
const FORM_ID = 'blog-form'

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
]

// Fields whose server errors are shown under the field itself.
// The server starts those messages with the field name, e.g. "slug: Another blog already uses…"
const SERVER_ERROR_FIELDS: (keyof BlogFormValues)[] = [
  'title',
  'slug',
  'excerpt',
  'content',
  'category',
  'tags',
  'authorName',
  'metaTitle',
  'metaDescription',
]

const emptyFormValues: BlogFormValues = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: '',
  tags: [],
  authorName: '',
  status: 'draft',
  isFeatured: false,
  metaTitle: '',
  metaDescription: '',
  existingCoverUrl: null,
  newCoverImage: null,
}

// The form's starting values: the blog being edited, or empty for a new blog
function getStartValues(blog: Blog | null): BlogFormValues {
  if (!blog) {
    return emptyFormValues
  }
  return {
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    content: blog.content,
    category: blog.category,
    tags: blog.tags,
    authorName: blog.authorName,
    status: blog.status,
    isFeatured: blog.isFeatured,
    metaTitle: blog.metaTitle,
    metaDescription: blog.metaDescription,
    existingCoverUrl: blog.coverImageUrl,
    newCoverImage: null,
  }
}

// Text for the main Save button
function getSaveLabel(isEditing: boolean, status: BlogStatus): string {
  if (isEditing) return 'Save changes'
  if (status === 'published') return 'Publish blog'
  return 'Save draft'
}

// The full page form for writing a new blog or editing one
export function BlogForm({ blogToEdit, categorySuggestions, onSaved }: BlogFormProps) {
  // React Compiler can cache React Hook Form's changing formState (errors, isDirty) and show stale errors, so skip it here
  'use no memo'

  const isEditing = blogToEdit !== null

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: getStartValues(blogToEdit),
    // Check a field once the user leaves it, then re-check it live as they fix it
    mode: 'onTouched',
  })

  const addMutation = useAddBlog()
  const editMutation = useEditBlog()
  const uploadImageMutation = useUploadBlogImage()

  // A new blog's slug follows the title until the admin types their own.
  // An existing blog keeps its slug, because changing it breaks links people already shared.
  const [isSlugTypedByHand, setIsSlugTypedByHand] = useState(isEditing)

  // Live values for the character counters and the Google preview
  const title = useWatch({ control, name: 'title' })
  const slug = useWatch({ control, name: 'slug' })
  const excerpt = useWatch({ control, name: 'excerpt' })
  const status = useWatch({ control, name: 'status' })
  const metaTitle = useWatch({ control, name: 'metaTitle' })
  const metaDescription = useWatch({ control, name: 'metaDescription' })

  const titleField = register('title', {
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      if (!isSlugTypedByHand) {
        setValue('slug', makeSlug(event.target.value))
      }
    },
  })

  const slugField = register('slug', {
    onChange: () => setIsSlugTypedByHand(true),
    // Tidy the slug when the admin leaves the box, e.g. "My Blog!" -> "my-blog"
    onBlur: (event: FocusEvent<HTMLInputElement>) => {
      const cleanSlug = makeSlug(event.target.value)
      if (cleanSlug === '') {
        // Emptied: follow the title again
        setIsSlugTypedByHand(false)
        setValue('slug', makeSlug(getValues('title')), { shouldValidate: true })
      } else {
        setValue('slug', cleanSlug, { shouldValidate: true })
      }
    },
  })

  // Uploads an image from inside the editor and gives back its link
  async function uploadEditorImage(file: File): Promise<string> {
    const image = await uploadImageMutation.mutateAsync(file)
    return image.url
  }

  // Shows a server error under its field when it belongs to one, otherwise at the top of the form
  function showServerError(message: string) {
    for (const fieldName of SERVER_ERROR_FIELDS) {
      const prefix = fieldName + ': '
      if (message.startsWith(prefix)) {
        setError(fieldName, { message: message.slice(prefix.length) }, { shouldFocus: true })
        return
      }
    }
    // 'root' is a form-wide error that isn't tied to one field
    setError('root', { message: message })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Only runs once every field has passed validation (the schema has already trimmed the text)
  async function saveBlog(values: BlogFormValues) {
    // The admin removed the saved cover image (and may or may not have picked a new one)
    let removeCoverImage = false
    if (blogToEdit && blogToEdit.coverImageUrl && values.existingCoverUrl === null) {
      removeCoverImage = true
    }

    const blogData: NewBlog = {
      title: values.title,
      slug: values.slug,
      excerpt: values.excerpt,
      content: values.content,
      category: values.category,
      tags: values.tags,
      authorName: values.authorName,
      status: values.status,
      isFeatured: values.isFeatured,
      metaTitle: values.metaTitle,
      metaDescription: values.metaDescription,
      coverImage: values.newCoverImage,
      removeCoverImage: removeCoverImage,
    }

    try {
      let savedBlog: Blog
      if (blogToEdit) {
        savedBlog = await editMutation.mutateAsync({ blogId: blogToEdit.id, blog: blogData })
      } else {
        savedBlog = await addMutation.mutateAsync(blogData)
      }
      onSaved(savedBlog, isEditing)
    } catch (error) {
      let message = 'The blog could not be saved. Please try again.'
      if (error instanceof Error && error.message) {
        message = error.message
      }
      showServerError(message)
    }
  }

  // Runs when Save is pressed but some fields are wrong (they may be far down the page)
  function handleInvalidForm() {
    setError('root', { message: 'Some fields need your attention. Please check the messages in red.' })
  }

  const saveLabel = getSaveLabel(isEditing, status)

  return (
    <>
      <PageHeader
        title={isEditing ? 'Edit blog' : 'New blog'}
        description={isEditing ? 'Update the blog post and save your changes.' : 'Write a blog post with images, videos and tables.'}
        actions={
          <>
            <Link
              to={ROUTES.blogs}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-line px-4 text-sm font-semibold text-ink transition-colors hover:bg-surface-muted"
            >
              <ArrowLeft className="size-4" strokeWidth={2} />
              Back to blogs
            </Link>
            <Button type="submit" form={FORM_ID} icon={Save} isLoading={isSubmitting}>
              {isSubmitting ? 'Saving…' : saveLabel}
            </Button>
          </>
        }
      />

      {/* noValidate turns off the browser's own validation popups, so only our messages show */}
      <form
        id={FORM_ID}
        onSubmit={handleSubmit(saveBlog, handleInvalidForm)}
        noValidate
        className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start"
      >
        {/* Main column: title, slug, excerpt and the editor */}
        <div className="min-w-0 space-y-6">
          {errors.root?.message && <Alert variant="error" title={errors.root.message} />}

          <Card className="space-y-5">
            <FormField
              label="Title"
              htmlFor="blogTitle"
              error={errors.title?.message}
              labelExtra={<BlogCharacterCounter length={title.length} maxLength={TITLE_MAX_LENGTH} />}
            >
              <TextInput
                id="blogTitle"
                placeholder="e.g. 7 Tips for a Stress-Free Heathrow Airport Transfer"
                autoComplete="off"
                maxLength={TITLE_MAX_LENGTH}
                {...titleField}
                hasError={!!errors.title}
              />
            </FormField>

            <FormField
              label="URL slug"
              htmlFor="blogSlug"
              error={errors.slug?.message}
              hint={
                isEditing
                  ? 'Changing the slug breaks links that people have already shared.'
                  : 'Made from the title. You can change it.'
              }
            >
              <TextInput
                id="blogSlug"
                prefix="/blog/"
                placeholder="heathrow-airport-transfer-tips"
                autoComplete="off"
                maxLength={SLUG_MAX_LENGTH}
                {...slugField}
                hasError={!!errors.slug}
              />
            </FormField>

            <FormField
              label="Excerpt"
              htmlFor="blogExcerpt"
              error={errors.excerpt?.message}
              isOptional
              hint="A short summary shown on blog cards and lists."
              labelExtra={<BlogCharacterCounter length={excerpt.length} maxLength={EXCERPT_MAX_LENGTH} />}
            >
              <TextArea
                id="blogExcerpt"
                placeholder="One or two sentences about what readers will learn."
                {...register('excerpt')}
                hasError={!!errors.excerpt}
              />
            </FormField>
          </Card>

          <FormField label="Content" htmlFor="blogContent" error={errors.content?.message}>
            {/* Controller connects inputs that aren't a plain text box to the form */}
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  id="blogContent"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onUploadImage={uploadEditorImage}
                  hasError={!!errors.content}
                />
              )}
            />
          </FormField>
        </div>

        {/* Side column: publishing, cover image, category/tags and SEO */}
        <aside className="min-w-0 space-y-6">
          <Card className="space-y-5">
            <FormSection title="Publish">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <SegmentedControl
                    label="Blog status"
                    options={STATUS_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full"
                  />
                )}
              />
              <p className="mt-2 text-xs text-muted">
                {status === 'published'
                  ? 'Published blogs are ready to show on the website.'
                  : 'Drafts are only visible here in the admin.'}
              </p>
            </FormSection>

            <Controller
              name="isFeatured"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  role="switch"
                  aria-checked={field.value}
                  onClick={() => field.onChange(!field.value)}
                  className="flex w-full items-center justify-between gap-4 rounded-xl border border-line px-3.5 py-3 text-left"
                >
                  <span className="flex items-start gap-2.5">
                    <Star className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2} />
                    <span>
                      <span className="block text-sm font-medium text-ink">Featured blog</span>
                      <span className="block text-xs text-muted">Show it first on the website.</span>
                    </span>
                  </span>
                  <Switch isOn={field.value} />
                </button>
              )}
            />

            {blogToEdit && (
              <dl className="space-y-1.5 rounded-xl bg-surface-muted px-3.5 py-3 text-xs">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">First published</dt>
                  <dd className="font-medium text-ink">{formatBlogDate(blogToEdit.publishedAt)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Last updated</dt>
                  <dd className="font-medium text-ink">{formatBlogDate(blogToEdit.updatedAt)}</dd>
                </div>
              </dl>
            )}

            <Button type="submit" icon={Save} isLoading={isSubmitting} className="w-full">
              {isSubmitting ? 'Saving…' : saveLabel}
            </Button>
          </Card>

          <Card>
            <FormSection title="Cover image" description="Shown at the top of the blog and when it is shared.">
              <FormField label="Cover image" htmlFor="blogCoverImage" error={errors.newCoverImage?.message} isOptional>
                <Controller
                  name="newCoverImage"
                  control={control}
                  render={({ field: newCoverField }) => (
                    <Controller
                      name="existingCoverUrl"
                      control={control}
                      render={({ field: existingCoverField }) => (
                        <BlogCoverImageInput
                          id="blogCoverImage"
                          existingUrl={existingCoverField.value}
                          newFile={newCoverField.value}
                          onRemoveExisting={() => existingCoverField.onChange(null)}
                          onNewFileChange={newCoverField.onChange}
                          hasError={!!errors.newCoverImage}
                        />
                      )}
                    />
                  )}
                />
              </FormField>
            </FormSection>
          </Card>

          <Card className="space-y-5">
            <FormSection title="Organise">
              <div className="space-y-5">
                <FormField label="Category" htmlFor="blogCategory" error={errors.category?.message} isOptional>
                  <TextInput
                    id="blogCategory"
                    // Lets the browser suggest the categories other blogs already use
                    list="blog-category-suggestions"
                    placeholder="e.g. Airport Guides"
                    autoComplete="off"
                    maxLength={CATEGORY_MAX_LENGTH}
                    {...register('category')}
                    hasError={!!errors.category}
                  />
                  <datalist id="blog-category-suggestions">
                    {categorySuggestions.map((category) => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
                </FormField>

                <FormField label="Tags" htmlFor="blogTags" error={errors.tags?.message} isOptional>
                  <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                      <BlogTagsInput
                        id="blogTags"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        hasError={!!errors.tags}
                      />
                    )}
                  />
                </FormField>

                <FormField label="Author" htmlFor="blogAuthor" error={errors.authorName?.message} isOptional>
                  <TextInput
                    id="blogAuthor"
                    placeholder="e.g. Elite Rides Team"
                    autoComplete="off"
                    maxLength={AUTHOR_MAX_LENGTH}
                    {...register('authorName')}
                    hasError={!!errors.authorName}
                  />
                </FormField>
              </div>
            </FormSection>
          </Card>

          <Card>
            <FormSection title="SEO" description="How the blog appears on Google. Leave empty to use the title and excerpt.">
              <div className="space-y-5">
                <FormField
                  label="Meta title"
                  htmlFor="blogMetaTitle"
                  error={errors.metaTitle?.message}
                  isOptional
                  labelExtra={
                    <BlogCharacterCounter
                      length={metaTitle.length}
                      maxLength={META_TITLE_MAX_LENGTH}
                      idealLength={META_TITLE_IDEAL_LENGTH}
                    />
                  }
                >
                  <TextInput
                    id="blogMetaTitle"
                    placeholder="Shown as the blue link on Google"
                    autoComplete="off"
                    {...register('metaTitle')}
                    hasError={!!errors.metaTitle}
                  />
                </FormField>

                <FormField
                  label="Meta description"
                  htmlFor="blogMetaDescription"
                  error={errors.metaDescription?.message}
                  isOptional
                  labelExtra={
                    <BlogCharacterCounter
                      length={metaDescription.length}
                      maxLength={META_DESCRIPTION_MAX_LENGTH}
                      idealLength={META_DESCRIPTION_IDEAL_LENGTH}
                    />
                  }
                >
                  <TextArea
                    id="blogMetaDescription"
                    placeholder="Shown under the link on Google"
                    {...register('metaDescription')}
                    hasError={!!errors.metaDescription}
                  />
                </FormField>

                <BlogSeoPreview
                  title={metaTitle || title}
                  slug={slug}
                  description={metaDescription || excerpt}
                />
              </div>
            </FormSection>
          </Card>
        </aside>
      </form>
    </>
  )
}
