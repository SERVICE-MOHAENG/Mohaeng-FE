import { CreateTripForm, TripFormData } from '@mohang/ui';
import { useNavigate } from 'react-router-dom';

export function CreateTripPage() {
  const navigate = useNavigate();

  const handleSubmit = (data: TripFormData) => {
    console.log('여행 생성:', data);
    // TODO: API 호출하여 여행 생성
    alert(`여행이 생성되었습니다!\n목적지: ${data.destination}\n일정: ${data.startDate} ~ ${data.endDate}\n인원: ${data.travelers}명`);
    navigate('/');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <CreateTripForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}

export default CreateTripPage;
