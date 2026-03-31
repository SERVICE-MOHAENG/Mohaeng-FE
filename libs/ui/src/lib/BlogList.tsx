import { useEffect, useState } from 'react';
import { colors, typography } from '@mohang/ui';

export interface BlogListProps {
  selectedSort?: 'latest' | 'popular';
  onBlogChange?: (sortBy: 'latest' | 'popular') => void;
}

export function BlogList({
  selectedSort = 'latest',
  onBlogChange,
}: BlogListProps) {
  const [selectedBlog, setSelectedBlog] = useState<'latest' | 'popular'>(
    selectedSort,
  );

  const blogs: Array<{ key: 'latest' | 'popular'; label: string }> = [
    { key: 'latest', label: '최신순' },
    { key: 'popular', label: '인기순' },
  ];

  useEffect(() => {
    setSelectedBlog(selectedSort);
  }, [selectedSort]);

  const handleBlogClick = (sortBy: 'latest' | 'popular') => {
    setSelectedBlog(sortBy);
    onBlogChange?.(sortBy);
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
          여행 블로그 보기
        </h2>
        <p style={{ ...typography.body.BodyM, color: colors.gray[400] }}>
          생생한 여행 후기를 한눈에 읽어보세요
        </p>
      </div>
      <div className="flex gap-3 flex-wrap">
        {blogs.map((blog) => (
          <button
            key={blog.key}
            className={`px-7 py-3 rounded-full font-bold text-base transition-all ${
              selectedBlog === blog.key
                ? 'bg-[#00CCFF] text-white hover:bg-[#00CCFF]'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleBlogClick(blog.key)}
            style={{ fontFamily: 'Paperozi' }}
          >
            {blog.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default BlogList;
