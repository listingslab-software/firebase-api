export type TemplateOptions = {
  subject: string;
  to: string;
  from: string;
  html: string;
  text: string;
};

export const htmlTemplate = (options: TemplateOptions) => {
  const {
    html,
    subject,
  } = options;
  return `<div>
            <h2>${subject}</h2>
            <p>${html}</p>
          </div>`;
};
