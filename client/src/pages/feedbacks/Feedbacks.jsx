import React, { useEffect } from "react";
import Header from "../../components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeedbacks } from "../../store/ActionApis/feedbackApi";
import SearchAndFilterTable from "../../components/filterTable/SearchAndFilterTable";
import { feedbackColumn } from "../../components/columns/Columns";

const Feedbacks = () => {
  const dispatch = useDispatch();
  const { feedbacks } = useSelector((state) => state.feedback);
  console.log(feedbacks);

  useEffect(() => {
    dispatch(fetchFeedbacks());
  }, []);
  return (
    <>
      <div>
        <Header />
      </div>
      <SearchAndFilterTable
        data={feedbacks}
        columns={feedbackColumn}
        tableType="feedbacks"
      />
    </>
  );
};

export default Feedbacks;
