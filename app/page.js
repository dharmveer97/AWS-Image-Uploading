'use client';

import { withFormik } from 'formik';
import * as yup from 'yup';
// import { isEmpty } from 'lodash';
import Dropzone from '../components/elements/Dropzone';

const IndexPage = (props) => {
  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    setFieldValue,
  } = props;
  // console.log(values, 'values');
  // const handleRemoveImage = (index) => {
  // // used to remove images which are uploaded or saved in local
  //   const updatedImages = values.images.filter((_, i) => i !== index);
  //   setFieldValue('images', updatedImages);
  // };

  const onUpload = (uploadedFiles) => {
    const fileUrls = uploadedFiles.map((file) => file.fileUrl);
    setFieldValue('images', [...values.images, ...fileUrls]);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
    >
      <div className="sm:col-span-6">
        <div className="mt-2">
          <Dropzone
            value={values.images}
            placeholder="Choose and capture"
            onUpload={onUpload}
            onChange={handleChange}
            onBlur={handleBlur}
            multiple
          />
        </div>
      </div>

      <div className="mt-2">
        {values?.images &&
          values.images.map((item, i) => {
            const key = `${i}`;
            return (
              <div key={key}>
                <img src={item} alt="imageAlt" />

                {/* // create Button here to remove image by index or provided URL id */}
              </div>
            );
          })}
      </div>

      <div className="sm:col-span-6">
        <button onClick={handleSubmit} type="submit" color="primary">
          {isSubmitting ? 'loading' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default withFormik({
  mapPropsToValues: ({ initialValues }) => ({
    images: initialValues ? initialValues?.images : [],
  }),

  validationSchema: yup.object().shape({
    images: yup.array().required('Images are required').nullable(),
  }),

  handleSubmit: (values, { setSubmitting, props }) => {
    props
      .onSubmit(values)
      .then(() => {
        setSubmitting(false);
      })
      .catch(() => {
        setSubmitting(false);
      });
  },
  displayName: 'IndexPage',
})(IndexPage);
