import { useFormContext } from 'react-hook-form'
import { FormField } from '../../../shared/components/forms/FormField'
import { TextInput } from '../../../shared/components/inputs/TextInput'
import type { SettingsFormValues } from '../types/settings'
import { SettingsSection } from './SettingsSection'

// Company name, emails and website link
export function OfficeSettingsSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SettingsFormValues>()
  const officeErrors = errors.office

  return (
    <SettingsSection title="Office" description="Your company details used across the app and in emails.">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Company name" htmlFor="companyName" error={officeErrors?.companyName?.message}>
          <TextInput id="companyName" {...register('office.companyName')} hasError={!!officeErrors?.companyName} />
        </FormField>
        <FormField label="App name" htmlFor="appName" error={officeErrors?.appName?.message}>
          <TextInput id="appName" {...register('office.appName')} hasError={!!officeErrors?.appName} />
        </FormField>
        <FormField label="Currency symbol" htmlFor="currency" error={officeErrors?.currency?.message}>
          <TextInput id="currency" {...register('office.currency')} hasError={!!officeErrors?.currency} />
        </FormField>
        <FormField
          label="Site URL"
          htmlFor="siteUrl"
          isOptional
          hint="Your main website, e.g. https://example.com"
          error={officeErrors?.siteUrl?.message}
        >
          <TextInput id="siteUrl" {...register('office.siteUrl')} hasError={!!officeErrors?.siteUrl} />
        </FormField>
        <FormField label="Company email" htmlFor="companyEmail" hint="New booking emails are sent here." error={officeErrors?.companyEmail?.message}>
          <TextInput id="companyEmail" type="email" {...register('office.companyEmail')} hasError={!!officeErrors?.companyEmail} />
        </FormField>
        <FormField label="From email" htmlFor="fromEmail" hint="Customers see this as the sender." error={officeErrors?.fromEmail?.message}>
          <TextInput id="fromEmail" type="email" {...register('office.fromEmail')} hasError={!!officeErrors?.fromEmail} />
        </FormField>
      </div>
    </SettingsSection>
  )
}
