import type { Metadata } from "next";
import { notFound } from "next/navigation";
import portfolio from "@/data/portfolio.json";
import ProjectContactLinks from "@/components/ui/ProjectContactLinks";

type Project = (typeof portfolio)[number];

// This is the part WebGL can never give you for free: every project gets
// its own crawlable URL, its own <title>/<meta description>, and its own
// Open Graph image — so ads and shared links preview correctly and each
// piece can rank on its own for "کاشی دست‌ساز [نام پروژه]".
export async function generateStaticParams() {
  return portfolio.map((p) => ({ slug: p.id }));
}

function getProject(slug: string): Project | undefined {
  return portfolio.find((p) => p.id === slug);
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = getProject(params.slug);
  if (!project) return {};

  const title = `${project.title} | زروان — سرامیک و کاشی دست‌ساز`;
  const description = `${project.poem} — ${project.summary}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: project.image, width: 1200, height: 800 }],
      type: "article",
    },
    alternates: {
      canonical: `https://zervan.studio/projects/${project.id}`,
    },
  };
}

export default function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProject(params.slug);
  if (!project) notFound();

  // Structured data so Google understands this as a real product/work,
  // independent of whatever the canvas is doing on top of it.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    image: `https://zervan.studio${project.image}`,
    creator: {
      "@type": "Organization",
      name: "زروان",
      url: "https://zervan.studio",
    },
    locationCreated: project.location,
    material: project.materials.join(", "),
  };

  return (
    <>
      {/* This markup renders server-side and is what search engines and
          link-preview crawlers actually read. The 3D experience mounts
          on top of / instead of this for real visitors with JS + WebGL. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-3xl px-6 py-16 text-stone-100" dir="rtl">
        <h1 className="font-serif text-4xl mb-2">{project.title}</h1>
        <p className="text-amber-400 italic mb-6">{project.poem}</p>
        <img
          src={project.image}
          alt={project.title}
          className="rounded-lg mb-6 w-full object-cover"
        />
        <p className="leading-8 text-stone-300 mb-4">{project.summary}</p>
        <dl className="grid grid-cols-2 gap-4 text-sm text-stone-400 mb-10">
          <div>
            <dt className="text-stone-500">مکان</dt>
            <dd>{project.location}</dd>
          </div>
          <div>
            <dt className="text-stone-500">متریال</dt>
            <dd>{project.materials.join("، ")}</dd>
          </div>
        </dl>
        <ProjectContactLinks projectTitle={project.title} />
      </article>
    </>
  );
}
