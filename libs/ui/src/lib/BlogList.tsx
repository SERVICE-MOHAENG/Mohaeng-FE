import { useState } from 'react';
import { colors, typography } from '@mohang/ui';

export interface BlogListProps {
  onBlogChange?: (blog: string) => void;
}

export function BlogList({ onBlogChange }: BlogListProps) {
  const [selectedBlog, setSelectedBlog] = useState('최신순');

  const blogs = ['최신순', '인기순'];

  const handleBlogClick = (blog: string) => {
    setSelectedBlog(blog);
    onBlogChange?.(blog);
  };

  return (
    <div className="mt-12 mb-8">
      <div className="mb-6">
        <h2
          className="mb-3"
          style={{
            ...typography.title.TitleB,
            color: colors.gray[800],
            fontFamily: 'Paperozi',
          }}
        >
          사람들이 생성한 인기있는 <br />
          여행코스에요!
        </h2>
        <p style={{ ...typography.body.BodyM, color: colors.gray[400] }}>
          실제 경험을 바탕으로 코스를 짰어요!
        </p>
      </div>
      <div className="flex gap-3 flex-wrap">
        {blogs.map((blog) => (
          <button
            key={blog}
            className={`px-7 py-3 rounded-full font-bold text-base transition-all ${
              selectedBlog === blog
                ? 'bg-[#00CCFF] text-white hover:bg-[#00CCFF]'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleBlogClick(blog)}
            style={{ fontFamily: 'Paperozi' }}
          >
            {blog}
          </button>
        ))}
      </div>
    </div>
  );
}

export default BlogList;
