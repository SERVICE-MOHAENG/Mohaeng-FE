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
        여행 기간을 선택해주세요!
        <br />
        전체 여행 일정 기준으로 최소 1일, 최대 8일까지 선택할 수 있어요.
      </p>
    </div>
  );
};
