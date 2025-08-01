import { prepareInstructions } from "constants/index";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);
    setStatusText("Analyzing your resume...");
    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile) return setStatusText("Error uploading file");

    setStatusText("Converting to image...");
    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file || imageFile.error)
      return setStatusText(
        imageFile.error || "Error converting pdf file to image",
      );

    setStatusText("Uploading image...");
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) return setStatusText("Error uploading image");

    setStatusText("Preparing data...");

    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: "",
    };

    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText("Analyzing resume...");

    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription }),
    );
    if (!feedback) return setStatusText("Error analyzing resume");

    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Resume analyzed successfully, redirecting...");
    console.log(data);
    navigate(`/resume/${uuid}`);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) return;
    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart feedback for your desired job</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img
                src="/images/resume-scan.gif"
                alt="Resume scan"
                className="w-full"
              />
            </>
          ) : (
            <>
              <h2>Upload your resume for an ATS score and feedback</h2>
            </>
          )}
          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8"
            >
              <div className="form-div">
                <label htmlFor="Company Name">Company Name</label>
                <input
                  type="text"
                  name="company-name"
                  id="company-name"
                  placeholder="Company Name"
                />
              </div>
              <div className="form-div">
                <label htmlFor="Job Title">Job Title</label>
                <input
                  type="text"
                  name="job-title"
                  id="job-title"
                  placeholder="Job Title"
                />
              </div>
              <div className="form-div">
                <label htmlFor="Job Description">Job Description</label>
                <textarea
                  rows={5}
                  name="job-description"
                  id="job-description"
                  placeholder="Job Description"
                />
              </div>
              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>
              <button className="primary-button" type="submit">
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
