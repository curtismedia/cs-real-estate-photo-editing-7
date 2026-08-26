// SERVICE TERMS & POLICIES — shown at the final booking step and stored as an
// acceptance flag on every submission. Edit the wording here only.

export const policyIntro =
  'A short summary of how projects run, so there are no surprises on either side.'

export const policies = [
  {
    id: 'confirmation',
    title: 'Project Confirmation',
    body: [
      'Once we receive your project request submission, we will review the submitted files, project scope, selected services, instructions and requested turnaround time.',
      'After the review, we will send you a confirmation email with the project details, final pricing and any additional information if required.',
      'Production will begin only after the project has been confirmed and the required payment or deposit has been received.',
    ],
  },
  {
    id: 'pricing',
    title: 'Pricing',
    body: [
      'Website prices and automatically calculated totals may be estimates.',
      'For services with variable complexity or displayed price ranges, the final price will be confirmed after we review your project files and requirements.',
      'The final project amount will be confirmed before payment is requested.',
    ],
  },
  {
    id: 'payment',
    title: 'Payment',
    body: [
      'Production begins after the project has been confirmed and the required payment has been received.',
      'You may choose either full payment or a 50% deposit, where available.',
      'If a 50% deposit is selected, the remaining balance will be due after the final deliverables have been completed and before final delivery, unless otherwise agreed in writing.',
    ],
  },
  {
    id: 'turnaround',
    title: 'Turnaround Time',
    body: [
      'Turnaround time begins once the project has been confirmed, all required files and instructions have been received, and the required payment or deposit has been received.',
      'Standard turnaround is generally 8–24 hours.',
      'Rush turnaround of 4–8 hours is subject to an additional 30% rush fee.',
      'Extreme rush requests requiring delivery in under 4 hours are subject to an additional 50% rush fee.',
      'Rush turnaround availability may still depend on project scope and must be confirmed by CS before production begins.',
    ],
  },
  {
    id: 'files',
    title: 'Client Files & Instructions',
    body: [
      'You are responsible for providing accessible source files, working file links and clear editing instructions.',
      'Missing files, inaccessible links or incomplete instructions may delay the project.',
    ],
  },
  {
    id: 'revisions',
    title: 'Revisions',
    body: [
      'We provide reasonable revisions to ensure that the delivered work matches the originally agreed instructions and requirements.',
      'Requests involving new creative directions, additional services, new source files or major changes outside the original project scope may require additional charges.',
    ],
  },
  {
    id: 'delivery',
    title: 'Final Delivery',
    body: [
      'Final and high-resolution deliverables may be released after all outstanding payment obligations for the project have been completed.',
    ],
  },
  {
    id: 'storage',
    title: 'File Storage',
    body: [
      'We do not guarantee permanent file storage.',
      'After receiving the completed deliverables, you are responsible for downloading and securely storing your files.',
    ],
  },
  {
    id: 'cancellation',
    title: 'Cancellation',
    body: [
      'If production has not yet started, cancellation requests may be reviewed depending on the current project status.',
      'Once production has started, completed work and resources already used or committed to the project may be non-refundable.',
    ],
  },
  {
    id: 'rights',
    title: 'Rights & Responsibility',
    body: [
      'You confirm that you have the necessary rights or authorization to provide the source files and media for editing.',
      'You remain responsible for how the final deliverables are used, published or distributed after delivery.',
    ],
  },
]

/** Plain-language explanation shown beside the payment options. */
export const paymentNotes = [
  'No payment is collected directly on this website.',
  'After you submit your project request, our team will review your files, selected services, editing instructions, turnaround requirements and final project scope.',
  'Once your project is confirmed, payment instructions will be sent to the email address provided with your booking.',
  'Please follow the payment instructions received by email. Production begins after the required payment has been received.',
]

export const POLICY_ACCEPT_LABEL =
  'I have reviewed and agree to the Service Terms & Policies.'
