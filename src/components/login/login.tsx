import { type FormEvent, useState, type JSX } from "react";
import arrow1 from "../../../public/arrow-1.svg";
import { authApi } from "../../api/authApi";
import { authLogin } from "../../mocks/authMock"

//백엔드 API 연동 플래그 (true: 임시 테스트 모드, false: 실제 백엔드 API 호출)
const USE_MOCK_DATA = true;

const fields = [
  {
    id: "user-id",
    name: "username",
    label: "아이디",
    placeholder: "아이디 (사원번호)",
    top: "top-[431px]",
    type: "text",
    autoComplete: "username",
  },
  {
    id: "password",
    name: "password",
    label: "비밀번호",
    placeholder: "비밀번호",
    top: "top-[570px]",
    type: "password",
    autoComplete: "current-password",
  },
];

export const Screen = (): JSX.Element => {
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!formValues.username.trim() || !formValues.password.trim()) {
      setErrorMessage("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      if (USE_MOCK_DATA) {
        // Mock 데이터 환경
        const res = await authLogin({
          username: formValues.username,
          password: formValues.password,
        });
        alert(`${res.user.name}님 환영합니다!`);
        window.location.href = "/"; // 메인 페이지 이동
      } else {
        // 실제 API 연동 환경
        const res = await authApi.login({
          username: formValues.username,
          password: formValues.password,
        });
        localStorage.setItem("access_token", res.access_token);
        window.location.href = "/";
      }
    } catch (error: any) {
      console.error("로그인 실패:", error);
      setErrorMessage(
        error.message || error.response?.data?.message || "로그인 정보가 올바르지 않습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative h-[1080px] w-[1920px] overflow-hidden bg-[#020618]">
      {/* 배경 장식 원 */}
      <div
        aria-hidden="true"
        className="absolute left-[-121px] top-[29px] h-[1022px] w-[1022px] rounded-[511px] bg-[#00b8db]"
      />

      <form
        className="contents"
        noValidate
        onSubmit={handleSubmit}
        aria-label="HRIS 로그인"
      >
        {fields.map((field) => (
          <div
            key={field.id}
            className={`absolute left-[960px] flex h-[72px] w-[532px] items-center gap-3 rounded-xl bg-[#314158] px-4 py-3 ${field.top}`}
          >
            <label className="sr-only" htmlFor={field.id}>
              {field.label}
            </label>
            <input
              id={field.id}
              name={field.name}
              type={field.type}
              value={formValues[field.name as keyof typeof formValues]}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
              onChange={(event) =>
                setFormValues((currentValues) => ({
                  ...currentValues,
                  [field.name]: event.target.value,
                }))
              }
              className="relative min-w-0 flex-1 [font-family:'Noto_Sans_KR-Regular',Helvetica] text-2xl font-normal leading-6 tracking-[0] text-[#90a1b9] placeholder:text-[#90a1b9] focus-visible:ring-2 focus-visible:ring-[#00b8db] focus-visible:ring-offset-2 focus-visible:ring-offset-[#314158] outline-none bg-transparent"
            />
          </div>
        ))}

        {/* 에러 메시지 표시 */}
        {errorMessage && (
          <div className="absolute left-[960px] top-[660px] w-[532px] text-red-400 text-lg font-['Noto_Sans_KR-Regular']">
            {errorMessage}
          </div>
        )}

        {/* 타이틀 */}
        <h1 className="absolute left-[1140px] top-[242px] flex h-[42px] w-[140px] flex-col items-start">
          <span className="relative mt-[-1.00px] mr-[-12.00px] whitespace-nowrap [font-family:'Noto_Sans_KR-Bold',Helvetica] text-[64px] font-bold leading-7 tracking-[-0.45px] text-white">
            HRIS
          </span>
        </h1>

        {/* 로그인 화살표 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          aria-label="로그인"
          className="absolute left-[1536px] top-[487px] flex h-[107px] w-[107px] items-start rounded-[53.5px] bg-[#00b8db] pl-[21px] pr-7 pt-[53px] pb-[54px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#020618] cursor-pointer disabled:opacity-50 hover:bg-[#00a3c2] transition-colors"
        >
          <img
            className="relative ml-[-2.00px] mr-[-2.00px] mt-[-14.73px] mb-[-14.73px] h-[29.46px] w-[62px]"
            alt=""
            aria-hidden="true"
            src={arrow1}
          />
        </button>
      </form>
    </main>
  );
};