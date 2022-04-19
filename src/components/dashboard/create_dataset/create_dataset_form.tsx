import './create_dataset_form.scss';

import {
  EuiButton,
  EuiFieldText,
  EuiFilePicker,
  EuiForm,
  EuiFormRow,
} from '@elastic/eui';
import { Formik } from 'formik';
import * as Yup from 'yup';

type CreateDatasetValues = {
  name: string;
  file: File;
};

const initialValues: CreateDatasetValues = {
  name: 'Mi dataset',
  file: null,
};

const schema = Yup.object().shape({
  name: Yup.string().required('Introduce un nombre'),
  file: Yup.mixed().required('Introduce un fichero'),
});

export const CreateDatasetForm: React.FC = () => {
  const submit = ({ name, file }: CreateDatasetValues) => {
    console.log(name, file);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={submit}
    >
      {({
        handleSubmit,
        errors,
        touched,
        values,
        handleChange,
        setFieldValue,
      }) => (
        <EuiForm component="form" onSubmit={handleSubmit}>
          <EuiFormRow
            label="Nombre"
            isInvalid={errors.name && touched.name}
            error={errors.name}
            fullWidth
          >
            <EuiFieldText
              name="name"
              type="text"
              value={values.name}
              onChange={handleChange}
              data-testid="name-input"
              fullWidth
            />
          </EuiFormRow>
          <EuiFormRow
            label="Fichero"
            isInvalid={!!errors.file}
            error={errors.file}
            fullWidth
          >
            <EuiFilePicker
              initialPromptText="Selecciona un fichero"
              name="file"
              onChange={files => {
                if (files?.length > 0) {
                  setFieldValue('file', files[0]);
                } else {
                  setFieldValue('file', null);
                }
              }}
              fullWidth
              accept=".json,.csv,text"
            />
          </EuiFormRow>
          <div className="createDataset__form__submit">
            <EuiButton fill type="submit">
              Crear dataset
            </EuiButton>
          </div>
        </EuiForm>
      )}
    </Formik>
  );
};
