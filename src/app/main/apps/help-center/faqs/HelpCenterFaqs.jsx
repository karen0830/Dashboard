import Button from "@mui/material/Button";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import FaqList from "./FaqList";
import {
  useGetHelpCenterFaqCategoriesQuery,
  useGetHelpCenterFaqsQuery,
} from "../HelpCenterApi";

/**
 * The help center faqs page.
 */
function HelpCenterFaqs() {
  const navigate = useNavigate();
  const { data: faqs } = useGetHelpCenterFaqsQuery();
  const { data: categories } = useGetHelpCenterFaqCategoriesQuery();
  const groupedFaqs = useMemo(() => {
    return categories?.map((category) => ({
      ...category,
      faqs: faqs?.filter((faq) => faq.categoryId === category.id),
    }));
  }, [faqs, categories]);
  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <div className="flex flex-col items-center p-24 sm:p-40">
      <div className="flex flex-col w-full max-w-4xl">
        <div className="sm:mt-32">
          <Button
            onClick={handleGoBack}
            color="secondary"
            startIcon={
              <FuseSvgIcon>heroicons-outline:arrow-narrow-left</FuseSvgIcon>
            }
          >
            Regresar Al Centro De Ayuda
          </Button>
        </div>
        <div className="mt-8 text-4xl sm:text-7xl font-extrabold tracking-tight leading-tight text-white">
          Preguntas Frecuentes
        </div>

        {groupedFaqs?.map((category) => (
          <div key={category.id}>
            <Typography className="mt-48 sm:mt-64 text-3xl font-bold leading-tight tracking-tight">
              {category.title}
            </Typography>
            <FaqList className="w-full mt-32" list={category.faqs} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default HelpCenterFaqs;
