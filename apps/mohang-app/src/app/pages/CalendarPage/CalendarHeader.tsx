import React from 'react';
import { typography, colors } from '@mohang/ui';

export const CalendarHeader: React.FC = () => {
  return (
    <div className="text-center my-8">
      <h1 className="mb-4" style={{ ...typography.title.sTitleB }}>
        일정 선택
      </h1>
      <p
        className="leading-relaxed"
        style={{ color: colors.gray[400], ...typography.body.BodyM }}
      >
        희망하는 여행 기간을 선택해주세요!
        <br />
        최소 1일 이상, 8일 이하로 선택해야 합니다!
      </p>
    </div>
  );
};
