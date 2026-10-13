import ArticleIcon from "@mui/icons-material/Article";
import SectionHeading from "../components/ui/SectionHeading";

type BlogPost = {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
};

// Empty until there are real posts to publish — see FAQ.tsx for the same
// "nothing here yet" fallback pattern used below.
const posts: BlogPost[] = [];

function PostCard({ post }: { post: BlogPost }) {
  return (
    <article className="flex flex-col rounded-lg border border-secondary-100 bg-white p-6 transition-colors hover:border-primary-300">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-primary-500">
        <span>{post.category}</span>
        <span className="text-secondary-200">&bull;</span>
        <span className="font-normal normal-case tracking-normal text-caption">
          {post.date}
        </span>
      </div>
      <p className="mt-3 font-display text-h3 font-semibold leading-snug text-heading">
        {post.title}
      </p>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-body">{post.excerpt}</p>
      <p className="mt-4 text-xs font-medium text-caption">{post.readTime}</p>
    </article>
  );
}

export default function Blog() {
  return (
    <section className="py-[120px]">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <SectionHeading
          align="center"
          theme="light"
          eyebrow="Blog"
          eyebrowColor="primary"
          heading="Insights on decision intelligence"
          description="Perspectives on inventory, procurement, and the future of decision intelligence for the enterprise."
          className="mx-auto max-w-2xl"
          descriptionClassName="mx-auto"
        />

        {posts.length > 0 ? (
          <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.title} post={post} />
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-14 flex max-w-xl flex-col items-center rounded-2xl border border-dashed border-secondary-100 bg-white px-10 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-500">
              <ArticleIcon style={{ fontSize: 22 }} />
            </span>
            <p className="mt-5 font-display text-h4 font-semibold text-heading">
              We&rsquo;re working on our first posts
            </p>
            <p className="mt-2 text-sm leading-relaxed text-caption">
              Check back soon for perspectives on inventory, procurement, and
              decision intelligence.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
