import React from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import recognizeError from 'lib/apollo/recognizeError';
import errors from 'lib/apollo/recognizeError/errors';

import TEACHER_SUBJECTS_SUBJECT_POINT_SYSTEM_CREATE_OR_UPDATE_POINT_SYSTEM_MUTATION from 'pages/teacherSubjects/subject/pointSystem/mutation/createOrUpdatePointSystem';

import {
  TeacherSubejctsSubjectPointSystemCreateExamMutation,
  TeacherSubejctsSubjectPointSystemCreateExamMutationVariables,
  TeacherSubjectsSubjectPointSystemCreateOrUpdatePointsSystemMutation,
  TeacherSubjectsSubjectPointSystemCreateOrUpdatePointsSystemMutationVariables,
  TeacherSubjectsSubjectPointSystemSubjectQuery,
  TeacherSubjectsSubjectPointSystemSubjectQueryVariables,
} from 'types/graphql';

import withPage from 'components/withPage';

import TEACHER_SUBJECTS_SUBJECT_POINT_SYSTEM_CREATE_EXAM_MUTATION from './mutation/addExam';
import TEACHER_SUBJECTS_SUBJECT_POINT_SYSTEM_SUBJECT_QUERY from './queries/subject';
import subjectPageOptions from './pageOptions';
import PointSystem from './pointSystem';
import { Exams, Students } from './types';

const PointSystemIndex: React.FC = () => {
  const router = useRouter();
  const { data: subjectData, loading: subjectLoading } = useQuery<
    TeacherSubjectsSubjectPointSystemSubjectQuery,
    TeacherSubjectsSubjectPointSystemSubjectQueryVariables
  >(TEACHER_SUBJECTS_SUBJECT_POINT_SYSTEM_SUBJECT_QUERY, {
    variables: { id: `${router.query.id}` },
  });
  const [createExam, { loading: createExamLoading }] = useMutation<
    TeacherSubejctsSubjectPointSystemCreateExamMutation,
    TeacherSubejctsSubjectPointSystemCreateExamMutationVariables
  >(TEACHER_SUBJECTS_SUBJECT_POINT_SYSTEM_CREATE_EXAM_MUTATION, {
    refetchQueries: ['TeacherSubjectsSubjectPointSystemSubjectQuery'],
    awaitRefetchQueries: true,
  });

  const { enqueueSnackbar } = useSnackbar();

  const examCreateHandler = (): void => {
    createExam({
      variables: {
        input: {
          name: 'new test',
          subject: `${router.query.id}`,
        },
      },
    })
      .then(() => {
        enqueueSnackbar('S', { variant: 'success' });
      })
      .catch(err => {
        const recognizedError = recognizeError(err);
        if (recognizedError === errors.looprError.noSchoolPeriodActive) {
          enqueueSnackbar('NO SCHOOL PERIOD', { variant: 'warning' });
        } else {
          enqueueSnackbar('E', { variant: 'error' });
        }
      });
  };

  const exams: Exams = [];

  const students: Students = [];
  // Set students basic info
  if (subjectData?.subject?.classGroup?.users?.edges) {
    for (const groupUser of subjectData.subject.classGroup.users.edges) {
      if (groupUser?.node) {
        students.push({
          id: groupUser.node.id,
          firstname: groupUser.node.firstname,
          lastname: groupUser.node.lastname,
          exams: [],
        });
      }
    }
  } else if (subjectData?.subject?.group?.users?.edges) {
    for (const groupUser of subjectData.subject.group.users.edges) {
      if (groupUser?.node) {
        students.push({
          id: groupUser.node.id,
          firstname: groupUser.node.firstname,
          lastname: groupUser.node.lastname,
          exams: [],
        });
      }
    }
  }

  // Set exams and studentExams
  for (const exam of subjectData?.subject?.exams?.edges || []) {
    const examNode = exam?.node;
    if (examNode) {
      exams.push({
        id: examNode.id,
        name: examNode.name,
        maxPoints: examNode.pointSystem?.maxPoints || 0,
      });

      const examPoints: {
        user: { id: string };
        points: number;
        examWritten: boolean;
      }[] = [];

      examNode.pointSystem?.points?.edges?.forEach(point => {
        if (point?.node) {
          examPoints.push(point.node);
        }
      });

      students.forEach(student => {
        const studentExam = examPoints.find(
          examPoint => examPoint.user.id === student.id,
        );
        student.exams.push({
          id: examNode.id,
          points: studentExam?.points || 0,
          examWritten: studentExam?.examWritten || false,
        });
      });
    }
  }

  return (
    <PointSystem
      loading={subjectLoading || createExamLoading}
      exams={exams}
      students={students}
      onExamCreate={examCreateHandler}
    />
  );
};

export default withPage(subjectPageOptions)(PointSystemIndex);
