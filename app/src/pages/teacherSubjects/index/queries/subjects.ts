import { gql } from '@apollo/client';

const TEACHER_SUBJECTS_SUBJECTS_QUERY = gql`
  query TeacherSubjectsSubjectsQuery($exists: [SubjectFilter_exists]) {
    meUser {
      taughtSubjects(exists: $exists) {
        edges {
          node {
            id
            teacherCardColor
            evaluationSystem
            archivedAt
            group {
              id
              section
              classParentsNames
            }
            classGroup {
              id
              year
              section
            }
            subjectType {
              id
              name
            }
          }
        }
      }
    }
  }
`;

export default TEACHER_SUBJECTS_SUBJECTS_QUERY;
