import mongoose from 'mongoose';
import { Branch } from '../models/Branch.model';

/**
 * Resolves a branch reference (ObjectId string or code like 'KTK', 'VND') to a valid Mongoose ObjectId.
 * Returns null if 'ALL' or empty.
 * Returns a non-matching ObjectId if the branch code does not exist in DB, preventing CastErrors.
 */
export async function resolveBranchObjectId(branchRef?: any): Promise<mongoose.Types.ObjectId | null> {
  if (!branchRef || branchRef === 'ALL' || branchRef === 'all') return null;
  const str = branchRef.toString().trim();
  if (!str) return null;

  if (mongoose.Types.ObjectId.isValid(str) && /^[0-9a-fA-F]{24}$/.test(str)) {
    return new mongoose.Types.ObjectId(str);
  }

  const branch = await Branch.findOne({ code: str.toUpperCase(), isDeleted: false });
  if (branch) {
    return branch._id as mongoose.Types.ObjectId;
  }

  // Dummy non-matching ObjectId so query safely yields 0 results instead of crashing with CastError
  return new mongoose.Types.ObjectId();
}

/**
 * Resolves array of branch references (ObjectIds or codes) to array of valid Mongoose ObjectIds for document save/update.
 */
export async function resolveBranchObjectIds(branchRefs?: any): Promise<mongoose.Types.ObjectId[]> {
  if (!branchRefs) return [];
  const list = Array.isArray(branchRefs) ? branchRefs : [branchRefs];
  const result: mongoose.Types.ObjectId[] = [];

  for (const item of list) {
    if (!item || item === 'ALL' || item === 'all') continue;
    const resolved = await resolveBranchObjectId(item);
    if (resolved) {
      result.push(resolved);
    }
  }

  return result;
}
