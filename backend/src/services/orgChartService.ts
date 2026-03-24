import { departmentRepository } from '../repositories/departmentRepository';

export const orgChartService = {
  getOrgChart: async () => {
    return departmentRepository.findRoots();
  },
};
