import {refinement, Integer as IntegerType} from 'tcomb'
export const VersionNumberType = refinement(IntegerType, n => n > 0, 'VersionNumberType')
