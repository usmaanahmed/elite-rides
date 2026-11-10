import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Button } from '../../../shared/components/buttons/Button'
import { Alert } from '../../../shared/components/feedback/Alert'
import { PageHeader } from '../../../shared/components/PageHeader'
import { DiscountSettingsSection } from '../components/DiscountSettingsSection'
import { ExtrasSettingsSection } from '../components/ExtrasSettingsSection'
import { GeneralSettingsSection } from '../components/GeneralSettingsSection'
import { OfficeSettingsSection } from '../components/OfficeSettingsSection'
import { PricingSettingsSection } from '../components/PricingSettingsSection'
import { useSaveSettings, useSettings } from '../hooks/useSettings'
import { settingsFormSchema } from '../schemas/settingsFormSchema'
import type { SettingsFormValues } from '../types/settings'
import { formValuesToSettings, settingsToFormValues } from '../utils/settingsFormConversion'

const FORM_ID = 'settings-form'

export function SettingsPage() {
  const settingsQuery = useSettings()
  const saveMutation = useSaveSettings()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    mode: 'onTouched',
  })
  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = form

  // When the saved settings arrive from the server, fill the form with them
  useEffect(() => {
    if (settingsQuery.data) {
      reset(settingsToFormValues(settingsQuery.data))
    }
  }, [settingsQuery.data, reset])

  // Only runs once every field has passed validation
  async function saveAllSettings(values: SettingsFormValues) {
    setSuccessMessage(null)
    try {
      await saveMutation.mutateAsync(formValuesToSettings(values))
      setSuccessMessage('Settings were saved')
    } catch (error) {
      let message = 'Settings could not be saved. Please try again.'
      if (error instanceof Error && error.message) {
        message = error.message
      }
      setError('root', { message })
    }
  }

  if (settingsQuery.isPending) {
    return (
      <>
        <PageHeader title="Settings" description="Company, pricing and booking settings." />
        <div className="mt-8 h-64 animate-pulse rounded-2xl bg-surface-muted" />
      </>
    )
  }

  if (settingsQuery.isError) {
    return (
      <>
        <PageHeader title="Settings" description="Company, pricing and booking settings." />
        <div className="mt-8 space-y-3">
          <Alert variant="error" title="Settings could not be loaded" description={settingsQuery.error.message} />
          <Button variant="secondary" onClick={() => settingsQuery.refetch()} isLoading={settingsQuery.isFetching}>
            Try again
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Company, pricing and booking settings."
        actions={
          <Button type="submit" form={FORM_ID} icon={Save} isLoading={isSubmitting}>
            Save All Settings
          </Button>
        }
      />

      {successMessage && (
        <Alert variant="success" title={successMessage} onDismiss={() => setSuccessMessage(null)} className="mt-6" />
      )}
      {errors.root?.message && <Alert variant="error" title={errors.root.message} className="mt-6" />}

      {/* noValidate turns off the browser's own validation popups, so only our messages show */}
      <FormProvider {...form}>
        <form id={FORM_ID} onSubmit={handleSubmit(saveAllSettings)} noValidate className="mt-8 space-y-6">
          <OfficeSettingsSection />
          <PricingSettingsSection />
          <ExtrasSettingsSection />
          <GeneralSettingsSection />
          <DiscountSettingsSection />

          <div className="flex justify-end">
            <Button type="submit" icon={Save} isLoading={isSubmitting}>
              Save All Settings
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  )
}
